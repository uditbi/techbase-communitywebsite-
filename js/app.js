/* ============================================================
   TECH-BASE — Application script
   Vanilla ES2020. No framework, no build step.
   Features: icon hydration · nav · smooth scroll · reveal ·
             counters · ecosystem expand · journey progress ·
             program & project filters/search · FAQ accordion ·
             project/legal modal · contact form validation+submit
   ============================================================ */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ============================================================
     0. ICON HYDRATION (local inline Lucide paths — no CDN)
     ============================================================ */
  const ICONS = {
    'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    'arrow-up': '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    'plus': '<path d="M5 12h14"/><path d="M12 5v14"/>',
    'check': '<path d="M20 6 9 17l-5-5"/>',
    'menu': '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
    'search': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    'search-x': '<path d="m13.5 8.5 5 5"/><path d="m18.5 8.5-5 5"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    'compass': '<circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2.9 6.3-6.3 2.9 2.9-6.3z"/>',
    'users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    'users-round': '<path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/>',
    'folder-kanban': '<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/><path d="M8 10v4"/><path d="M12 10v2"/><path d="M16 10v6"/>',
    'sparkles': '<path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9L12 18.4l1.9-5.8 5.8-1.9-5.8-1.9z"/><path d="M19 3v4"/><path d="M21 5h-4"/>',
    'bar-chart-3': '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    'brain-circuit': '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6.003 18.875A3 3 0 0 1 6.401 17.5"/><path d="M17.599 17.5a3 3 0 0 1 .399 1.375"/><path d="M12 8v8"/>',
    'handshake': '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>',
    'hammer': '<path d="m15 12-8.373 8.373a1 1 0 1 1-3-3L12 9"/><path d="m18 15 4-4"/><path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172V7l-2.26-2.26a6 6 0 0 0-4.202-1.756L9 2.96l.92.82A6.18 6.18 0 0 1 12 8.4V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5"/>',
    'microscope': '<path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>',
    'building-2': '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
    'graduation-cap': '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    'eye': '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    'target': '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    'quote': '<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2h3a4 4 0 0 0 4-4V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2h3a4 4 0 0 0 4-4V5a2 2 0 0 0-2-2z"/>',
    'puzzle': '<path d="M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z"/>',
    'lightbulb': '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    'leaf': '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    'book-open': '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    'flask-conical': '<path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"/><path d="M6.453 15h11.094"/><path d="M8.5 2h7"/>',
    'trophy': '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
    'library': '<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>',
    'briefcase-business': '<path d="M12 12h.01"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M22 13a18.15 18.15 0 0 1-20 0"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
    'network': '<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/>',
    'log-in': '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/>',
    'clipboard-check': '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
    'presentation': '<path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/>',
    'flag': '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>',
    'gavel': '<path d="m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8"/><path d="m16 16 6-6"/><path d="m8 8 6-6"/><path d="m9 7 8 8"/><path d="m21 11-8-8"/>',
    'messages-square': '<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>',
    'timer': '<path d="M10 2h4"/><path d="M12 14l3-3"/><circle cx="12" cy="14" r="8"/>',
    'info': '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    'alert-circle': '<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
    'shield-check': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    'chart-no-axes-combined': '<path d="M12 16v5"/><path d="M16 14v7"/><path d="M20 10v11"/><path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15"/><path d="M4 18v3"/><path d="M8 14v7"/>',
    'swords': '<path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="m16 16 4 4"/><path d="M19 21l2-2"/><path d="M9.5 6.5 21 18v3h-3L6.5 9.5"/><path d="M11 5 5 11"/><path d="m8 8-4-4"/><path d="M5 3 3 5"/>',
    'landmark': '<path d="M10 18v-7"/><path d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M3 22h18"/><path d="M6 18v-7"/>',
    'boxes': '<path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"/><path d="m7 16.5-4.74-2.85"/><path d="m7 16.5 5-3"/><path d="M7 16.5v5.17"/><path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"/><path d="m17 16.5-5-3"/><path d="m17 16.5 4.74-2.85"/><path d="M17 16.5v5.17"/><path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"/><path d="M12 8 7.26 5.15"/><path d="m12 8 4.74-2.85"/><path d="M12 13.5V8"/>',
    'message-circle': '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    'user-plus': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>',
    'user-check': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>',
    'rocket': '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    'send': '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
    'mail': '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    'linkedin': '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
    'instagram': '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
    'external-link': '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    'clock': '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    'printer': '<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
    'loader': '<path d="M21 12a9 9 0 1 1-6.219-8.56"/>'
  };

  function hydrateIcons(root = document) {
    $$('[data-icon]', root).forEach((el) => {
      const name = el.getAttribute('data-icon');
      const path = ICONS[name];
      if (!path) return;
      el.setAttribute('viewBox', '0 0 24 24');
      el.setAttribute('fill', 'none');
      el.setAttribute('stroke', 'currentColor');
      el.setAttribute('stroke-width', '2');
      el.setAttribute('stroke-linecap', 'round');
      el.setAttribute('stroke-linejoin', 'round');
      el.setAttribute('aria-hidden', 'true');
      el.setAttribute('focusable', 'false');
      el.innerHTML = path;
      el.removeAttribute('data-icon');
    });
  }

  hydrateIcons();

  /* ============================================================
     1. PRELOADER
     ============================================================ */
  const preloader = $('#preloader');
  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add('is-done');
    setTimeout(() => preloader.remove(), 800);
  }
  if (document.readyState === 'complete') {
    setTimeout(hidePreloader, 250);
  } else {
    window.addEventListener('load', () => setTimeout(hidePreloader, 250));
    setTimeout(hidePreloader, 2600); // safety net
  }

  /* ============================================================
     2. TOAST
     ============================================================ */
  const toastEl = $('#toast');
  let toastTimer;
  function toast(message, iconName = 'info') {
    if (!toastEl) return;
    toastEl.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (ICONS[iconName] || ICONS.info) +
      '</svg><span></span>';
    toastEl.querySelector('span').textContent = message;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 3200);
  }

  /* ============================================================
     3. NAV — sticky, burger, active section, smooth scroll
     ============================================================ */
  const navShell = $('#navShell');
  const navBurger = $('#navBurger');
  const mobileMenu = $('#mobileMenu');
  const navLinks = $$('#navLinks a');
  const sections = $$('main section[id]');
  const progress = $('#scrollProgress');
  const toTop = $('#toTop');
  const journey = $('#journey');
  const journeyFill = $('#journeyFill');

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    navBurger.setAttribute('aria-expanded', 'false');
    navBurger.setAttribute('aria-label', 'Open menu');
    navBurger.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS.menu + '</svg>';
  }

  function openMenu() {
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    navBurger.setAttribute('aria-expanded', 'true');
    navBurger.setAttribute('aria-label', 'Close menu');
    navBurger.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS.x + '</svg>';
  }

  if (navBurger) {
    navBurger.addEventListener('click', () => {
      if (mobileMenu.classList.contains('is-open')) closeMenu();
      else openMenu();
    });
  }

  /* Smooth scroll with sticky-nav offset (works even if CSS scroll-behavior is disabled) */
  const NAV_OFFSET = 82;
  function scrollToId(id, focus = true) {
    const target = document.getElementById(id);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.pageYOffset - NAV_OFFSET;
    window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? 'auto' : 'smooth' });
    if (focus) {
      target.setAttribute('tabindex', '-1');
      setTimeout(() => target.focus({ preventScroll: true }), reduceMotion ? 0 : 420);
    }
    if (history.replaceState) history.replaceState(null, '', '#' + id);
  }

  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#' || a.hasAttribute('data-placeholder')) {
        if (a.hasAttribute('data-placeholder')) {
          e.preventDefault();
          toast(a.getAttribute('data-placeholder') + ' link will be added once the official profile is confirmed.', 'info');
        }
        return;
      }
      const id = href.slice(1);
      if (!document.getElementById(id)) return;
      e.preventDefault();
      closeMenu();
      scrollToId(id);
    });
  });

  /* Scroll-driven UI */
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.pageYOffset;

      if (navShell) navShell.classList.toggle('is-scrolled', y > 12);

      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';

      if (toTop) toTop.classList.toggle('is-visible', y > 700);

      /* active nav link */
      const probe = y + NAV_OFFSET + 40;
      let current = '';
      sections.forEach((s) => {
        if (s.offsetTop <= probe) current = s.id;
      });
      navLinks.forEach((a) => {
        if (a.getAttribute('href') === '#' + current) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      });

      /* journey progress */
      if (journey && journeyFill) {
        const r = journey.getBoundingClientRect();
        const vh = window.innerHeight;
        const passed = Math.min(r.height, Math.max(0, vh * 0.62 - r.top));
        journeyFill.style.height = (r.height ? (passed / r.height) * 100 : 0) + '%';
        $$('.jstep', journey).forEach((step) => {
          const sr = step.getBoundingClientRect();
          step.classList.toggle('is-active', sr.top < vh * 0.66);
        });
      }

      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
      closeModal();
    }
  });

  /* ============================================================
     4. REVEAL ON SCROLL
     ============================================================ */
  $$('.reveal-stagger').forEach((group) => {
    Array.from(group.children).forEach((child, i) => child.style.setProperty('--i', i));
  });

  const revealEls = $$('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  /* ============================================================
     5. ECOSYSTEM — expandable cards
     ============================================================ */
  $$('[data-eco]').forEach((card) => {
    card.addEventListener('click', () => {
      const open = card.getAttribute('aria-expanded') === 'true';
      card.setAttribute('aria-expanded', String(!open));
      const more = card.querySelector('.eco-card__more');
      if (more) more.firstChild.textContent = open ? 'Learn more ' : 'Show less ';
    });
  });

  /* ============================================================
     6. PROGRAM FILTERS
     ============================================================ */
  const programGrid = $('#programGrid');
  const programFilters = $('#programFilters');
  const programEmpty = $('#programEmpty');

  if (programGrid && programFilters) {
    const cards = $$('.prog-card', programGrid);

    programFilters.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-filter]');
      if (!btn) return;
      $$('[data-filter]', programFilters).forEach((b) => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      const cat = btn.dataset.filter;
      let visible = 0;
      cards.forEach((card) => {
        const show = cat === 'all' || card.dataset.cat === cat;
        card.hidden = !show;
        if (show) visible++;
      });
      programEmpty.classList.toggle('is-visible', visible === 0);
    });

    /* Learn-more toggles */
    $$('.prog-card__more', programGrid).forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.prog-card');
        const open = card.getAttribute('aria-expanded') === 'true';
        card.setAttribute('aria-expanded', String(!open));
        btn.setAttribute('aria-expanded', String(!open));
        btn.firstChild.textContent = open ? 'Learn more ' : 'Show less ';
      });
    });
  }

  /* ============================================================
     7. PROJECTS — filters + search
     ============================================================ */
  const projectGrid = $('#projectGrid');
  const projectFilters = $('#projectFilters');
  const projectEmpty = $('#projectEmpty');
  const projSearch = $('#projSearch');
  const projSearchClear = $('#projSearchClear');
  const projCount = $('#projCount');

  const projectState = { cat: 'all', query: '' };

  function applyProjectFilters() {
    if (!projectGrid) return;
    const cards = $$('.proj-card', projectGrid);
    const q = projectState.query.trim().toLowerCase();
    let visible = 0;

    cards.forEach((card) => {
      const catOk = projectState.cat === 'all' || card.dataset.cat === projectState.cat;
      const haystack = ((card.dataset.search || '') + ' ' + card.textContent).toLowerCase();
      const queryOk = !q || haystack.includes(q);
      const show = catOk && queryOk;
      card.hidden = !show;
      if (show) visible++;
    });

    if (projectEmpty) projectEmpty.classList.toggle('is-visible', visible === 0);
    if (projCount) {
      projCount.textContent =
        visible === cards.length
          ? cards.length + ' demonstration projects'
          : visible + ' of ' + cards.length + ' projects shown';
    }
    if (projSearchClear) projSearchClear.classList.toggle('is-visible', q.length > 0);
  }

  if (projectFilters) {
    projectFilters.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-filter]');
      if (!btn) return;
      $$('[data-filter]', projectFilters).forEach((b) => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      projectState.cat = btn.dataset.filter;
      applyProjectFilters();
    });
  }

  if (projSearch) {
    let t;
    projSearch.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        projectState.query = projSearch.value;
        applyProjectFilters();
      }, 140);
    });
    projSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        projSearch.value = '';
        projectState.query = '';
        applyProjectFilters();
      }
    });
  }

  if (projSearchClear) {
    projSearchClear.addEventListener('click', () => {
      projSearch.value = '';
      projectState.query = '';
      applyProjectFilters();
      projSearch.focus();
    });
  }

  /* ============================================================
     8. FAQ ACCORDION
     ============================================================ */
  $$('#faqAccordion .acc-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      const panel = document.getElementById(trigger.getAttribute('aria-controls'));
      trigger.setAttribute('aria-expanded', String(!expanded));
      if (panel) panel.dataset.open = String(!expanded);
    });
  });

  /* ============================================================
     9. MODAL — projects & legal
     ============================================================ */
  const modal = $('#modal');
  const modalBody = $('#modalBody');
  let lastFocused = null;

  function openModal(html, titleId) {
    if (!modal) return;
    lastFocused = document.activeElement;
    modalBody.innerHTML = html;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    const h = modalBody.querySelector('h2');
    if (h) {
      h.id = 'modalTitle';
      modal.setAttribute('aria-labelledby', 'modalTitle');
    }
    const closeBtn = modal.querySelector('.modal__close');
    if (closeBtn) setTimeout(() => closeBtn.focus(), 60);
    hydrateIcons(modal);
  }

  function closeModal() {
    if (!modal || !modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  $$('[data-modal-close]').forEach((el) => el.addEventListener('click', closeModal));

  /* simple focus trap */
  if (modal) {
    modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusables = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', modal).filter(
        (el) => !el.disabled && el.offsetParent !== null
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  /* Project detail modal */
  $$('[data-project]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.proj-card');
      if (!card) return;
      const title = card.querySelector('h3').textContent;
      const cat = card.querySelector('.proj-card__cat').textContent;
      const overview = card.querySelector('.proj-card__overview').textContent;
      const metaRows = $$('.proj-card__meta > div', card);
      const tools = $$('.proj-card__tools span', card).map((s) => s.textContent);

      let metaHtml = '';
      metaRows.forEach((row) => {
        const label = row.querySelector('span:first-child').textContent;
        const value = row.querySelector('span:last-child').textContent;
        metaHtml += '<h3>' + escapeHtml(label) + '</h3><p>' + escapeHtml(value) + '</p>';
      });

      const html =
        '<span class="proj-card__cat">' + escapeHtml(cat) + '</span>' +
        '<span class="proj-card__demo" style="margin-left:.5rem">Demonstration project</span>' +
        '<h2>' + escapeHtml(title) + '</h2>' +
        '<p>' + escapeHtml(overview) + '</p>' +
        metaHtml +
        (tools.length
          ? '<h3>Tools and methodologies</h3><div class="proj-card__tools">' +
            tools.map((t) => '<span>' + escapeHtml(t) + '</span>').join('') +
            '</div>'
          : '') +
        '<div class="notice" style="margin:1.5rem 0 0"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        ICONS.info +
        '</svg><div><strong>Demonstration only.</strong> This example illustrates the expected structure and methodology of a Tech-Base project. It is not a completed community project and implies no company, partner or client relationship.</div></div>' +
        '<div style="margin-top:1.4rem;display:flex;flex-wrap:wrap;gap:.6rem">' +
        '<a class="btn btn--primary" href="#contact" data-modal-goto="industry">Discuss a similar project<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS['arrow-right'] + '</svg></a>' +
        '<button class="btn btn--ghost" type="button" data-modal-close>Close</button>' +
        '</div>';

      openModal(html);
      $$('[data-modal-close]', modal).forEach((el) => el.addEventListener('click', closeModal));
      const goto = $('[data-modal-goto]', modal);
      if (goto) {
        goto.addEventListener('click', (e) => {
          e.preventDefault();
          closeModal();
          const intent = goto.getAttribute('data-modal-goto');
          setTimeout(() => {
            setInquiryIntent(intent);
            scrollToId('contact');
          }, 120);
        });
      }
    });
  });

  /* Legal modals */
  const LEGAL = {
    privacy: {
      title: 'Privacy Policy',
      body:
        '<span class="faq-tbc">Draft — subject to confirmation</span>' +
        '<p>Tech-Base Management Community is an independent, volunteer-led initiative. This policy explains, in outline, how information submitted through this website is handled. It is a draft and will be finalised before the community\u2019s official launch.</p>' +
        '<h3>What we collect</h3><p>Only the information you choose to submit through the contact form: name, email address, optional phone number, optional organization or college, role, inquiry type, subject and message.</p>' +
        '<h3>Why we collect it</h3><p>To respond to your inquiry and, where relevant, to follow up on membership, collaboration or mentorship interest.</p>' +
        '<h3>How it is handled</h3><p>Submissions are validated on the server and delivered to the community mailbox. We do not sell or rent your information. Access is limited to community volunteers who need it to respond.</p>' +
        '<h3>Retention</h3><p>Retention periods are not yet formally defined and will be documented when the policy is finalised.</p>' +
        '<h3>Your choices</h3><p>You may request correction or deletion of the information you submitted by writing through the contact form.</p>',
    },
    terms: {
      title: 'Terms and Conditions',
      body:
        '<span class="faq-tbc">Draft — subject to confirmation</span>' +
        '<p>These terms are a draft and will be finalised before official launch.</p>' +
        '<h3>Nature of the community</h3><p>Tech-Base is an independent, informal and volunteer-led community. It is not a registered company, university, placement agency or certification body.</p>' +
        '<h3>No guaranteed outcomes</h3><p>Participation does not guarantee employment, internships, certifications, placements or any specific outcome. Nothing on this site constitutes such a promise.</p>' +
        '<h3>Content accuracy</h3><p>Programmes listed on this site are proposed initiatives. Project cards are clearly labelled demonstration examples. Dates, partners and achievements are not implied unless explicitly stated.</p>' +
        '<h3>Acceptable use</h3><p>You agree not to submit false information, spam, or content that infringes the rights of others through this site.</p>',
    },
    guidelines: {
      title: 'Community Guidelines',
      body:
        '<span class="faq-tbc">Draft — subject to confirmation</span>' +
        '<p>A fuller guidelines document will be published as the community formalises. The principles below describe the intended culture.</p>' +
        '<h3>Contribute honestly</h3><p>Cite sources, state assumptions and do not present another person\'s work as your own.</p>' +
        '<h3>Collaborate respectfully</h3><p>Critique ideas, not people. Assume good intent, and give credit generously.</p>' +
        '<h3>Protect confidentiality</h3><p>Do not share organization-confidential material outside an agreed project scope.</p>' +
        '<h3>Keep learning practical</h3><p>Prefer a finished, imperfect deliverable over an unfinished perfect plan.</p>' +
        '<h3>Respect people\'s time</h3><p>This is a volunteer-led community. Be clear about what you need and by when.</p>',
    },
  };

  $$('[data-legal]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const doc = LEGAL[a.dataset.legal];
      if (!doc) return;
      openModal('<h2>' + doc.title + '</h2>' + doc.body);
      $$('[data-modal-close]', modal).forEach((el) => el.addEventListener('click', closeModal));
    });
  });

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* ============================================================
     10. INQUIRY INTENT (pre-fill from CTAs)
     ============================================================ */
  const INTENT_MAP = {
    general: { value: 'General Inquiry', subject: '' },
    membership: {
      value: 'Membership and Student Participation',
      subject: 'I would like to join Tech-Base Management Community',
    },
    industry: {
      value: 'Industry and Business Collaboration',
      subject: 'Business collaboration inquiry',
    },
    partnership: {
      value: 'Mentorship and Partnership',
      subject: 'Mentorship / partnership inquiry',
    },
  };

  const inquirySelect = $('#inquiryType');
  const subjectInput = $('#subject');
  const roleSelect = $('#role');
  const inqButtons = $$('.inq');

  function setInquiryIntent(key) {
    const map = INTENT_MAP[key];
    if (!map || !inquirySelect) return;
    inquirySelect.value = map.value;
    if (subjectInput && !subjectInput.value.trim() && map.subject) subjectInput.value = map.subject;
    if (roleSelect && !roleSelect.value) {
      if (key === 'membership') roleSelect.value = 'Student';
      if (key === 'industry') roleSelect.value = 'Organization';
      if (key === 'partnership') roleSelect.value = 'Mentor';
    }
    inqButtons.forEach((b) => b.classList.toggle('is-selected', b.dataset.inquiry === key));
    clearError('inquiryType');
    clearError('subject');
    const field = inquirySelect.closest('.field');
    if (field) {
      field.style.transition = 'none';
      inquirySelect.style.boxShadow = '0 0 0 4px rgba(108,59,206,.22)';
      setTimeout(() => {
        inquirySelect.style.boxShadow = '';
      }, 900);
    }
  }

  inqButtons.forEach((btn) => {
    btn.addEventListener('click', () => setInquiryIntent(btn.dataset.inquiry));
  });

  $$('[data-intent]').forEach((el) => {
    el.addEventListener('click', () => {
      const key = el.getAttribute('data-intent');
      setTimeout(() => setInquiryIntent(key), 260);
    });
  });

  /* ============================================================
     11. CONTACT FORM — validation + submission
     ============================================================ */
  const form = $('#contactForm');
  const formStatus = $('#formStatus');
  const submitBtn = $('#submitBtn');
  const formMode = $('#formMode');
  const formStartedAt = $('#formStartedAt');

  /* Backend endpoint. Same-origin PHP by default; swap for Supabase/Formspree if deployed elsewhere. */
  const ENDPOINT = 'api/contact.php';

  if (formStartedAt) formStartedAt.value = String(Date.now());

  /* Probe the backend so the UI never lies about what will happen */
  let backendAvailable = null;
  (async function probeBackend() {
    try {
      const res = await fetch(ENDPOINT + '?probe=1', { method: 'GET', headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('bad status');
      const data = await res.json();
      backendAvailable = data && data.ok === true;
    } catch (err) {
      backendAvailable = false;
    }
    if (formMode) {
      formMode.textContent = backendAvailable
        ? 'Form backend: connected (api/contact.php)'
        : 'Form backend: not connected — see setup notes';
    }
    if (formMode) formMode.style.color = backendAvailable ? '#1c6b3c' : '#a52a22';
  })();

  const VALIDATORS = {
    fullName: (v) => {
      if (!v.trim()) return 'Please enter your full name.';
      if (v.trim().length < 2) return 'Please enter at least 2 characters.';
      if (v.trim().length > 120) return 'Please keep your name under 120 characters.';
      return '';
    },
    email: (v) => {
      if (!v.trim()) return 'Please enter your email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'Please enter a valid email address (e.g. name@example.com).';
      if (v.trim().length > 180) return 'Please use a shorter email address.';
      return '';
    },
    phone: (v) => {
      if (!v.trim()) return '';
      if (!/^[+\d][\d\s()\-]{5,19}$/.test(v.trim())) return 'Please enter a valid phone number, or leave it empty.';
      return '';
    },
    inquiryType: (v) => (!v ? 'Please select an inquiry type.' : ''),
    subject: (v) => {
      if (!v.trim()) return 'Please add a subject.';
      if (v.trim().length < 4) return 'Please make the subject a little more specific.';
      if (v.trim().length > 160) return 'Please keep the subject under 160 characters.';
      return '';
    },
    message: (v) => {
      if (!v.trim()) return 'Please write your message.';
      if (v.trim().length < 20) return 'Please add a little more detail (at least 20 characters).';
      if (v.trim().length > 4000) return 'Please keep your message under 4000 characters.';
      return '';
    },
    consent: (v, el) => (el.checked ? '' : 'Please confirm the privacy consent to continue.'),
  };

  function setError(name, message) {
    const el = document.getElementById(name);
    if (!el) return;
    const errBox = document.getElementById('err-' + name);
    const field = el.closest('.field') || el.closest('.check');
    const wrap = el.type === 'checkbox' ? el.closest('.field') : field;
    if (wrap) wrap.classList.add('has-error');
    el.setAttribute('aria-invalid', 'true');
    if (errBox) {
      const span = errBox.querySelector('span');
      if (span) span.textContent = message;
      errBox.style.display = 'flex';
    }
  }

  function clearError(name) {
    const el = document.getElementById(name);
    if (!el) return;
    const errBox = document.getElementById('err-' + name);
    const field = el.closest('.field') || el.closest('.check');
    const wrap = el.type === 'checkbox' ? el.closest('.field') : field;
    if (wrap) wrap.classList.remove('has-error');
    el.removeAttribute('aria-invalid');
    if (errBox) errBox.style.display = '';
  }

  function validateField(name) {
    const el = document.getElementById(name);
    if (!el || !VALIDATORS[name]) return true;
    const msg = VALIDATORS[name](el.value, el);
    if (msg) {
      setError(name, msg);
      return false;
    }
    clearError(name);
    return true;
  }

  function validateAll() {
    const names = ['fullName', 'email', 'phone', 'inquiryType', 'subject', 'message', 'consent'];
    let firstBad = null;
    names.forEach((n) => {
      const ok = validateField(n);
      if (!ok && !firstBad) firstBad = n;
    });
    if (firstBad) {
      const el = document.getElementById(firstBad);
      const focusTarget = firstBad === 'consent' ? document.getElementById('consent') : el;
      if (focusTarget) {
        focusTarget.focus({ preventScroll: true });
        const rect = focusTarget.getBoundingClientRect();
        if (rect.top < 80 || rect.bottom > window.innerHeight - 40) {
          window.scrollTo({ top: rect.top + window.pageYOffset - 140, behavior: reduceMotion ? 'auto' : 'smooth' });
        }
      }
      return false;
    }
    return true;
  }

  if (form) {
    /* live validation after first blur */
    ['fullName', 'email', 'phone', 'subject', 'message'].forEach((name) => {
      const el = document.getElementById(name);
      if (!el) return;
      el.addEventListener('blur', () => validateField(name));
      el.addEventListener('input', () => {
        if (el.closest('.field') && el.closest('.field').classList.contains('has-error')) validateField(name);
      });
    });
    ['inquiryType', 'consent'].forEach((name) => {
      const el = document.getElementById(name);
      if (!el) return;
      el.addEventListener('change', () => validateField(name));
    });

    function showStatus(state, title, message) {
      if (!formStatus) return;
      const icon = state === 'success' ? 'check' : state === 'error' ? 'alert-circle' : 'info';
      formStatus.setAttribute('data-state', state);
      formStatus.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        ICONS[icon] +
        '</svg><div><strong>' + escapeHtml(title) + '</strong>' + escapeHtml(message) + '</div>';
      formStatus.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
    }

    function clearStatus() {
      if (!formStatus) return;
      formStatus.removeAttribute('data-state');
      formStatus.innerHTML = '';
    }

    function setLoading(on) {
      if (!submitBtn) return;
      submitBtn.setAttribute('data-loading', String(on));
      submitBtn.disabled = on;
      const label = submitBtn.querySelector('.btn__label');
      if (label) label.textContent = on ? 'Sending…' : 'Send Inquiry';
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearStatus();

      if (!validateAll()) {
        showStatus('error', 'Please check the form.', ' Some fields need your attention before sending.');
        toast('Please fix the highlighted fields.', 'alert-circle');
        return;
      }

      /* spam heuristics */
      const honey = document.getElementById('website');
      if (honey && honey.value.trim() !== '') {
        showStatus('error', 'Submission blocked.', ' The form was flagged as automated. Please try again.');
        return;
      }
      const started = Number(formStartedAt && formStartedAt.value) || 0;
      if (started && Date.now() - started < 2500) {
        showStatus('error', 'That was a little too quick.', ' Please take a moment and submit again.');
        return;
      }

      if (backendAvailable === false) {
        showStatus(
          'error',
          'The form backend is not connected yet.',
          ' This site is served without its submission endpoint, so nothing was sent. Integration required: deploy api/contact.php on a PHP host, or point ENDPOINT in js/app.js to a Supabase / form-service endpoint. No confirmation is shown because no message was delivered.'
        );
        return;
      }

      setLoading(true);

      const payload = {
        fullName: $('#fullName').value.trim(),
        email: $('#email').value.trim(),
        phone: $('#phone').value.trim(),
        organization: $('#organization').value.trim(),
        role: $('#role').value,
        inquiryType: $('#inquiryType').value,
        subject: $('#subject').value.trim(),
        message: $('#message').value.trim(),
        consent: $('#consent').checked,
        website: honey ? honey.value : '',
        formStartedAt: formStartedAt ? formStartedAt.value : '',
        source: 'website-contact',
      };

      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });

        let data = null;
        try {
          data = await res.json();
        } catch (parseErr) {
          data = null;
        }

        if (!res.ok || !data || data.ok !== true) {
          const detail = data && data.error ? data.error : 'The server returned an unexpected response (HTTP ' + res.status + ').';
          throw new Error(detail);
        }

        showStatus(
          'success',
          'Inquiry sent.',
          ' Thank you, ' + payload.fullName.split(' ')[0] + '. Your message has been received. A volunteer will respond to ' + payload.email + '.'
        );
        toast('Inquiry sent successfully.', 'check');
        form.reset();
        if (formStartedAt) formStartedAt.value = String(Date.now());
        inqButtons.forEach((b) => b.classList.remove('is-selected'));
      } catch (err) {
        showStatus(
          'error',
          'Message not sent.',
          ' ' + (err && err.message ? err.message : 'The request failed.') + ' Nothing was delivered — please try again, or use the official email once it is published.'
        );
        toast('Sending failed. Nothing was delivered.', 'alert-circle');
      } finally {
        setLoading(false);
      }
    });
  }

  /* ============================================================
     12. CARD SPOTLIGHT (pointer-follow glow)
     ============================================================ */
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    $$('.card, .prog-card, .aud-card, .vmp-panel').forEach((card) => {
      card.addEventListener('mousemove', (ev) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((ev.clientX - r.left) / r.width) * 100 + '%');
        card.style.setProperty('--my', ((ev.clientY - r.top) / r.height) * 100 + '%');
      });
    });
  }

  /* ============================================================
     13. YEAR + INITIAL STATE
     ============================================================ */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  applyProjectFilters();

  /* Deep link support (#contact etc. on first load) */
  if (location.hash) {
    const id = location.hash.slice(1);
    if (document.getElementById(id)) {
      setTimeout(() => scrollToId(id, false), 400);
    }
  }
})();
