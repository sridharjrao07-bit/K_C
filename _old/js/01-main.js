/* main.js — site-wide scripts (prefixed filename) */
document.addEventListener("DOMContentLoaded", function () {
  console.log("Artisan Launchpad: main.js loaded");

  // Hero reveal
  const hero = document.querySelector('.hero');
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (hero) {
    if (reduceMotion) hero.classList.add('animated');
    else requestAnimationFrame(() => hero.classList.add('animated'));
  }

  // Stagger reveal for feature cards
  const featureCards = Array.from(document.querySelectorAll('.feature-card'));
  const STAGGER_BASE = reduceMotion ? 10 : 80;
  featureCards.forEach((el, i) => {
    el.classList.add('stagger');
    el.style.setProperty('--delay', `${i * STAGGER_BASE}ms`);
    el.classList.add('animate-on-scroll');
    if (reduceMotion) el.classList.add('animated');
  });

  // Stats counter animation
  const counters = Array.from(document.querySelectorAll('.stat-number'));
  counters.forEach(counter => counter.textContent = '0');

  // IntersectionObserver to reveal elements and animate counters
  const COUNTER_DURATION = reduceMotion ? 0 : 900;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('animated');

      // if it's a counter, animate number
      if (el.classList.contains('stat-number')) {
        const target = parseInt(el.getAttribute('data-target') || el.textContent || '0', 10);
        if (reduceMotion) {
          el.textContent = target.toLocaleString();
        } else {
          animateCounter(el, target, COUNTER_DURATION);
        }
      }

      io.unobserve(el);
    });
  }, { threshold: 0.25 });

  // Observe counters and feature cards + testimonials/module cards
  document.querySelectorAll('.stat-number, .feature-card, .testimonial-card, .module-card, .product-card').forEach(node => {
    if (reduceMotion) {
      // already animated above for many nodes; ensure counters are set
      if (node.classList.contains('stat-number')) {
        const t = parseInt(node.getAttribute('data-target') || node.textContent || '0', 10);
        node.textContent = t.toLocaleString();
      }
    } else {
      io.observe(node);
    }
  });

  // Smooth reveal for other sections
  document.querySelectorAll('section, .quick-actions, .products-grid').forEach(s => {
    if (!s.classList.contains('animate-on-scroll')) s.classList.add('animate-on-scroll');
    if (reduceMotion) s.classList.add('animated');
    else io.observe(s);
  });
});

function animateCounter(node, end, duration) {
  const start = 0;
  const range = end - start;
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const value = Math.floor(progress * range + start);
    node.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

