/* ======================================================
   NaturGuard – Natural Mosquito Repellent
   script.js — Main JavaScript
   Author: NaturGuard Dev Team
   ====================================================== */

// ============================================================
// 1. NAVBAR — sticky, scroll-based styling, mobile toggle
// ============================================================
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
const navLinkEls = document.querySelectorAll('.nav-link');

// Add 'scrolled' class when user scrolls past 60px
function handleNavbarScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', handleNavbarScroll, { passive: true });

// Toggle mobile menu
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu when a link is clicked
navLinkEls.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

// ============================================================
// 2. ACTIVE NAV LINK — highlight section in viewport
// ============================================================
const sections = document.querySelectorAll('section[id]');

function setActiveNavLink() {
  const scrollPos = window.scrollY + 120; // offset for navbar height

  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);

    if (link) {
      if (scrollPos >= top && scrollPos < top + height) {
        navLinkEls.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}
window.addEventListener('scroll', setActiveNavLink, { passive: true });

// ============================================================
// 3. FADE-IN / REVEAL — Intersection Observer for animations
// ============================================================

// Observer for .reveal elements (sections on scroll)
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after animation fires to save resources
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,    // trigger when 12% of element is visible
    rootMargin: '0px 0px -40px 0px'
  }
);

// Observe all .reveal elements
document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// Observer for .fade-in elements (hero section immediate)
const fadeInObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeInObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.05 }
);

document.querySelectorAll('.fade-in').forEach(el => {
  fadeInObserver.observe(el);
});

// ============================================================
// 4. BACK-TO-TOP BUTTON
// ============================================================
const backToTop = document.getElementById('backToTop');

function handleBackToTop() {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}
window.addEventListener('scroll', handleBackToTop, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
// 5. SMOOTH SCROLL for anchor links (fallback for older browsers)
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  });
});

// ============================================================
// 6. GALLERY — keyboard accessibility (Enter/Space to zoom)
// ============================================================
document.querySelectorAll('.gallery-item').forEach(item => {
  item.setAttribute('tabindex', '0');
  item.setAttribute('role', 'button');

  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      item.classList.toggle('gallery-zoom');
    }
  });
});

// ============================================================
// 7. FLOW NODE HOVER ANIMATION (SVG)
// ============================================================
document.querySelectorAll('.flow-node').forEach(node => {
  node.addEventListener('mouseenter', () => {
    node.style.cursor = 'pointer';
    const rect = node.querySelector('rect');
    if (rect) rect.style.opacity = '0.9';
  });
  node.addEventListener('mouseleave', () => {
    const rect = node.querySelector('rect');
    if (rect) rect.style.opacity = '1';
  });
});

// ============================================================
// 8. INGREDIENT CARD — tilt micro-interaction on mouse move
// ============================================================
document.querySelectorAll('.ingredient-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const centerX = rect.left + rect.width  / 2;
    const centerY = rect.top  + rect.height / 2;
    const rotateX = ((e.clientY - centerY) / rect.height) * -6;
    const rotateY = ((e.clientX - centerX) / rect.width)  *  6;
    card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ============================================================
// 9. STAT COUNTER ANIMATION — counts up on viewport entry
// ============================================================
const statNumbers = document.querySelectorAll('.stat-number');

function animateCounter(el) {
  const text   = el.textContent.trim();
  const suffix = text.replace(/[\d.]/g, '');     // e.g. '%', 'h+', ''
  const target = parseFloat(text.replace(/[^\d.]/g, '')) || 0;
  const duration = 1400; // ms
  const start    = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);
    el.textContent = (target % 1 === 0 ? value : value.toFixed(1)) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

statNumbers.forEach(el => counterObserver.observe(el));

// ============================================================
// 10. PAGE LOAD — trigger hero fade-in immediately
// ============================================================
window.addEventListener('load', () => {
  // Trigger scroll handlers once on load to set initial states
  handleNavbarScroll();
  handleBackToTop();
  setActiveNavLink();

  // Kick hero elements visible with a small stagger
  document.querySelectorAll('.hero .fade-in').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 160);
  });
});
