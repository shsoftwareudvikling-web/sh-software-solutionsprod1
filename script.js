/* ─────────────────────────────────────────────
   SH Software Solutions — Main Script
───────────────────────────────────────────── */

'use strict';

// ── Language system ──────────────────────────
const translations = {
  da: {
    // Nav
    'nav-services':   'Services',
    'nav-about':      'Om mig',
    'nav-prices':     'Priser',
    'nav-portfolio':  'Portfolio',
    'nav-references': 'Referencer',
    'nav-contact':    'Kontakt',
    // Form placeholders
    'ph-name':    'Dit fulde navn',
    'ph-email':   'din@email.dk',
    'ph-phone':   '+45 00 00 00 00',
    'ph-message': 'Fortæl os om dit projekt...',
  },
  en: {
    'nav-services':   'Services',
    'nav-about':      'About me',
    'nav-prices':     'Prices',
    'nav-portfolio':  'Portfolio',
    'nav-references': 'References',
    'nav-contact':    'Contact',
    'ph-name':    'Your full name',
    'ph-email':   'your@email.com',
    'ph-phone':   '+45 00 00 00 00',
    'ph-message': 'Tell us about your project...',
  },
};

let currentLang = localStorage.getItem('sh-lang') || 'da';

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('sh-lang', lang);

  // Update all [data-da] / [data-en] elements
  document.querySelectorAll('[data-da]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text === null) return;
    // Use innerHTML for elements that may contain HTML entities
    if (el.tagName === 'OPTION') {
      el.textContent = text;
    } else {
      el.innerHTML = text;
    }
  });

  // Placeholders
  const t = translations[lang];
  const name    = document.getElementById('name');
  const email   = document.getElementById('email');
  const phone   = document.getElementById('phone');
  const message = document.getElementById('message');
  if (name)    name.placeholder    = t['ph-name'];
  if (email)   email.placeholder   = t['ph-email'];
  if (phone)   phone.placeholder   = t['ph-phone'];
  if (message) message.placeholder = t['ph-message'];

  // Toggle button styling
  document.getElementById('langDA').classList.toggle('lang-toggle__opt--active', lang === 'da');
  document.getElementById('langEN').classList.toggle('lang-toggle__opt--active', lang === 'en');

  // html lang attribute
  document.documentElement.lang = lang;
}

// Language toggle button
document.getElementById('langToggle').addEventListener('click', () => {
  applyLanguage(currentLang === 'da' ? 'en' : 'da');
});

// Init on load
applyLanguage(currentLang);


// ── Navigation scroll effect ──────────────────
const nav = document.getElementById('nav');
function updateNav() {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();


// ── Hamburger menu ────────────────────────────
const hamburger  = document.getElementById('hamburger');
const navMenu    = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu on nav link click
navMenu.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});


// ── Smooth scroll for anchor links ───────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h')) || 70;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth',
    });
  });
});


// ── Scroll reveal ─────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings in a grid
        const siblings = entry.target.parentElement
          ? [...entry.target.parentElement.children].filter(c => c.classList.contains('reveal'))
          : [];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${Math.min(idx * 80, 400)}ms`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// ── Active nav link on scroll ─────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav__link[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'nav__link--active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  },
  { threshold: 0.35 }
);
sections.forEach(s => sectionObserver.observe(s));


// ── Contact form ──────────────────────────────
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm.addEventListener('submit', async e => {
  e.preventDefault();

  // Simple validation
  let valid = true;
  contactForm.querySelectorAll('[required]').forEach(field => {
    field.classList.remove('form__input--error');
    if (!field.value.trim()) {
      field.classList.add('form__input--error');
      valid = false;
    }
  });
  if (!valid) return;

  const submitBtn = contactForm.querySelector('[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = currentLang === 'da' ? 'Sender...' : 'Sending...';

  try {
    const formData = new FormData(contactForm);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message'),
    };

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      contactForm.reset();
      formSuccess.hidden = false;
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => { formSuccess.hidden = true; }, 6000);
    } else {
      throw new Error('Failed to send');
    }
  } catch (error) {
    console.error('Form submission error:', error);
    alert(currentLang === 'da' 
      ? 'Der opstod en fejl. Prøv venligst igen.' 
      : 'An error occurred. Please try again.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.setAttribute('data-da', 'Send besked');
    submitBtn.setAttribute('data-en', 'Send message');
    applyLanguage(currentLang); // re-apply lang to restore button text
  }
});

// Clear error state on input
contactForm.querySelectorAll('.form__input').forEach(field => {
  field.addEventListener('input', () => field.classList.remove('form__input--error'));
});


// ── Typing animation for hero code window ────
(function typeCode() {
  const codeEl = document.querySelector('.code-window__body code');
  if (!codeEl) return;
  const original = codeEl.innerHTML;
  codeEl.innerHTML = '';
  codeEl.style.opacity = '1';

  // We type character by character but preserve HTML tags
  let i = 0;
  const chars = [];
  let inTag = false;
  let tag = '';

  for (const ch of original) {
    if (ch === '<') { inTag = true; tag = '<'; }
    else if (ch === '>' && inTag) { tag += '>'; chars.push(tag); inTag = false; tag = ''; }
    else if (inTag) { tag += ch; }
    else { chars.push(ch); }
  }

  let idx = 0;
  function type() {
    if (idx >= chars.length) return;
    codeEl.innerHTML += chars[idx++];
    setTimeout(type, idx < 10 ? 60 : 18 + Math.random() * 20);
  }

  // Start after a short delay
  setTimeout(type, 800);
})();
