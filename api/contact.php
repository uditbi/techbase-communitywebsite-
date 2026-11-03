<?php
/**
 * ============================================================
 *  TECH-BASE MANAGEMENT COMMUNITY — Contact form backend
 *  PHP 7.4+ / 8.x  ·  No framework, no dependencies
 * ============================================================
 *
 *  SETUP (5 minutes)
 *  -----------------
 *  1. Copy api/config.example.php to api/config.php
 *  2. Fill in MAIL_TO (the community inbox) and MAIL_FROM (a real
 *     mailbox on your domain — required by most SMTP hosts).
 *  3. Deploy the whole site to any PHP host (Hostinger, Namecheap,
 *     cPanel, Cloudways, InfinityFree, etc.). Vercel/Netlify cannot
 *     run PHP — see README-DEPLOY.md for the alternative.
 *  4. Open the site. The form header will read
 *     "Form backend: connected (api/contact.php)".
 *
 *  SECURITY
 *  --------
 *  · Server-side validation mirrors the client-side rules.
 *  · Honeypot field + minimum completion time for bots.
 *  · Simple per-IP rate limit (file based, 5 / hour).
 *  · Header-injection protection on every user-supplied header.
 *  · JSON body, size capped, no HTML rendering of user input.
 *  · Nothing is ever reported as "sent" unless mail() succeeds.
 *
 *  If your host has no mail() (common on shared hosts), replace the
 *  send block with PHPMailer/SMTP — the validation and response
 *  contract stay identical.
 * ============================================================
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
header('Referrer-Policy: same-origin');

// ---- Health probe: GET ?probe=1 -------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['probe'])) {
    $configured = file_exists(__DIR__ . '/config.php');
    echo json_encode([
        'ok' => $configured,
        'service' => 'tech-base-contact',
        'configured' => $configured,
        'message' => $configured
            ? 'Backend reachable and configured.'
            : 'Backend reachable but api/config.php is missing.',
    ]);
    exit;
}

// ---- Method guard ----------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST, GET');
    echo json_encode(['ok' => false, 'error' => 'Method not allowed.']);
    exit;
}

// ---- Load configuration ---------------------------------------------
$configFile = __DIR__ . '/config.php';
if (!file_exists($configFile)) {
    http_response_code(503);
    echo json_encode([
        'ok' => false,
        'error' => 'The form backend is not configured. Create api/config.php from api/config.example.php.',
    ]);
    exit;
}
$config = require $configFile;

$MAIL_TO      = $config['mail_to'] ?? '';
$MAIL_FROM    = $config['mail_from'] ?? '';
$SUBJECT_TAG  = $config['subject_prefix'] ?? '[Tech-Base]';
$RATE_LIMIT   = (int)($config['rate_limit_per_hour'] ?? 5);
$MIN_SECONDS  = (int)($config['min_seconds'] ?? 2);
$LOG_FILE     = $config['log_file'] ?? (__DIR__ . '/submissions.log');
$ALLOW_ORIGIN = $config['allowed_origin'] ?? '';

if (!$MAIL_TO || !$MAIL_FROM) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'Backend configuration is incomplete (mail_to / mail_from).']);
    exit;
}

// ---- Optional origin check (set allowed_origin when hosting elsewhere)
if ($ALLOW_ORIGIN !== '') {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '' && rtrim($origin, '/') !== rtrim($ALLOW_ORIGIN, '/')) {
        http_response_code(403);
        echo json_encode(['ok' => false, 'error' => 'Request origin not allowed.']);
        exit;
    }
}

// ---- Read and cap the body ------------------------------------------
$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > 65536) {
    http_response_code(413);
    echo json_encode(['ok' => false, 'error' => 'Payload too large.']);
    exit;
}

$data = json_decode($raw, true);
if (!is_array($data)) {
    // allow classic form posts too
    $data = $_POST;
}
if (!is_array($data) || !$data) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid request body.']);
    exit;
}

// ---- Helpers ---------------------------------------------------------
function field(array $data, string $key): string
{
    $v = $data[$key] ?? '';
    if (!is_string($v)) {
        return '';
    }
    // strip control chars and normalise whitespace
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v) ?? '';
    return trim($v);
}

function fail(string $message, int $code = 422): void
{
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $message]);
    exit;
}

$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

// ---- Rate limiting ---------------------------------------------------
$rateFile = sys_get_temp_dir() . '/tb_rate_' . md5($ip) . '.json';
$now = time();
$hits = [];
if (is_file($rateFile)) {
    $decoded = json_decode((string)file_get_contents($rateFile), true);
    if (is_array($decoded)) {
        $hits = array_values(array_filter($decoded, static fn($t) => is_int($t) && $t > $now - 3600));
    }
}
if (count($hits) >= $RATE_LIMIT) {
    fail('Too many submissions from this address. Please try again later.', 429);
}

// ---- Spam checks -----------------------------------------------------
$honeypot = field($data, 'website');
if ($honeypot !== '') {
    // silently accept-shaped response would hide the block; we tell the truth
    fail('Submission flagged as automated and discarded.');
}

$startedAt = (int)($data['formStartedAt'] ?? 0);
if ($startedAt > 0) {
    $elapsed = (int)round(($now * 1000 - $startedAt) / 1000);
    if ($elapsed >= 0 && $elapsed < $MIN_SECONDS) {
        fail('Submission was too fast to be genuine. Please try again.');
    }
}

// ---- Collect and validate -------------------------------------------
$fullName     = field($data, 'fullName');
$email        = field($data, 'email');
$phone        = field($data, 'phone');
$organization = field($data, 'organization');
$role         = field($data, 'role');
$inquiryType  = field($data, 'inquiryType');
$subject      = field($data, 'subject');
$message      = field($data, 'message');
$consent      = !empty($data['consent']);

$errors = [];

if (mb_strlen($fullName) < 2 || mb_strlen($fullName) > 120) {
    $errors[] = 'Full name must be between 2 and 120 characters.';
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 180) {
    $errors[] = 'A valid email address is required.';
}
if ($phone !== '' && !preg_match('/^[+\d][\d\s()\-]{5,19}$/', $phone)) {
    $errors[] = 'Phone number format is invalid.';
}
if (mb_strlen($organization) > 140) {
    $errors[] = 'Organization name is too long.';
}

$allowedInquiry = [
    'General Inquiry',
    'Membership and Student Participation',
    'Industry and Business Collaboration',
    'Mentorship and Partnership',
];
if (!in_array($inquiryType, $allowedInquiry, true)) {
    $errors[] = 'Please select a valid inquiry type.';
}

$allowedRoles = ['', 'Student', 'Professional', 'Entrepreneur', 'Mentor', 'Organization', 'Other'];
if (!in_array($role, $allowedRoles, true)) {
    $errors[] = 'Please select a valid role.';
}

if (mb_strlen($subject) < 4 || mb_strlen($subject) > 160) {
    $errors[] = 'Subject must be between 4 and 160 characters.';
}
if (mb_strlen($message) < 20 || mb_strlen($message) > 4000) {
    $errors[] = 'Message must be between 20 and 4000 characters.';
}
if (!$consent) {
    $errors[] = 'Privacy consent is required.';
}

if ($errors) {
    fail(implode(' ', $errors));
}

// ---- Header-injection guard -----------------------------------------
$clean = static function (string $s): string {
    return str_replace(["\r", "\n", "%0a", "%0d"], ' ', $s);
};
$email   = $clean($email);
$subject = $clean($subject);
$fullName = $clean($fullName);

// ---- Compose the email ----------------------------------------------
$mailSubject = $SUBJECT_TAG . ' ' . $inquiryType . ' — ' . $subject;

$bodyLines = [
    'New inquiry from the Tech-Base website',
    str_repeat('=', 44),
    '',
    'Inquiry type : ' . $inquiryType,
    'Subject      : ' . $subject,
    '',
    'Name         : ' . $fullName,
    'Email        : ' . $email,
    'Phone        : ' . ($phone !== '' ? $phone : '—'),
    'Organization : ' . ($organization !== '' ? $organization : '—'),
    'Role         : ' . ($role !== '' ? $role : '—'),
    '',
    'Message',
    str_repeat('-', 44),
    $message,
    '',
    str_repeat('-', 44),
    'Privacy consent : given',
    'Submitted at    : ' . gmdate('Y-m-d H:i:s') . ' UTC',
    'IP address      : ' . $ip,
    'User agent      : ' . ($_SERVER['HTTP_USER_AGENT'] ?? '—'),
];
$body = implode("\n", $bodyLines);

$headers = [
    'From: Tech-Base Website <' . $MAIL_FROM . '>',
    'Reply-To: ' . $fullName . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: Tech-Base/1.0',
];

// ---- Send ------------------------------------------------------------
$sent = false;
try {
    $sent = @mail($MAIL_TO, '=?UTF-8?B?' . base64_encode($mailSubject) . '?=', $body, implode("\r\n", $headers));
} catch (Throwable $e) {
    $sent = false;
}

// ---- Audit log (never blocks the response) ---------------------------
try {
    $logLine = json_encode([
        'at' => gmdate('c'),
        'ip' => $ip,
        'inquiry' => $inquiryType,
        'email' => $email,
        'sent' => $sent,
    ], JSON_UNESCAPED_SLASHES) . PHP_EOL;
    @file_put_contents($LOG_FILE, $logLine, FILE_APPEND | LOCK_EX);
} catch (Throwable $e) {
    // ignore logging failures
}

if (!$sent) {
    http_response_code(502);
    echo json_encode([
        'ok' => false,
        'error' => 'The server could not deliver the message. Nothing was sent. Please try again later, or contact the community through an official channel once published.',
    ]);
    exit;
}

// ---- Record the rate-limit hit only on success -----------------------
$hits[] = $now;
@file_put_contents($rateFile, json_encode($hits), LOCK_EX);

echo json_encode([
    'ok' => true,
    'message' => 'Inquiry received. Thank you — a volunteer will respond to your email address.',
]);
