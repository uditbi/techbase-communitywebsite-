<?php
/**
 * Copy this file to api/config.php and fill in the values.
 * api/config.php must never be committed with real credentials.
 */

return [
    // Where inquiries are delivered
    'mail_to' => 'contact@your-domain.example',

    // A real mailbox on your hosting domain (SMTP hosts reject mismatches)
    'mail_from' => 'no-reply@your-domain.example',

    // Prefix on the email subject line
    'subject_prefix' => '[Tech-Base]',

    // Spam controls
    'rate_limit_per_hour' => 5,
    'min_seconds' => 2,

    // Optional: only accept requests from this origin (e.g. 'https://techbase.org')
    'allowed_origin' => '',

    // Optional: audit log path
    'log_file' => __DIR__ . '/submissions.log',
];
