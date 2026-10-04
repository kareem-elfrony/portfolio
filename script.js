/* ============================================================
   KAREEM — CYBERSECURITY PORTFOLIO
   script.js
   ============================================================ */

'use strict';

/* ============================================================
   1. MATRIX RAIN CANVAS
   ============================================================ */
(function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const chars = '01アイウエオカキクケコサシスセソタチツテト<>{}[]|/\\#@$%&*ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const fontSize = 14;
  let columns, drops;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops   = Array(columns).fill(1);
  }

  function draw() {
    ctx.fillStyle = 'rgba(8, 13, 20, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00d4ff';
    ctx.font      = `${fontSize}px JetBrains Mono, monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 50);
})();


/* ============================================================
   2. TYPED TEXT EFFECT
   ============================================================ */
(function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const texts = [
    'Cybersecurity Analyst',
    'SOC Analyst',
    'Network Forensics',
    'Incident Responder',
    'Python Developer',
    'Threat Hunter'
  ];

  let textIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  let pause    = false;

  function type() {
    const current = texts[textIdx];

    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        pause = true;
        setTimeout(() => { pause = false; deleting = true; }, 2000);
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        textIdx  = (textIdx + 1) % texts.length;
      }
    }

    if (!pause) {
      setTimeout(type, deleting ? 60 : 100);
    }
  }

  setTimeout(type, 500);
})();


/* ============================================================
   3. NAVBAR — SCROLL & ACTIVE LINK
   ============================================================ */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.querySelectorAll('.nav-link');
  const hamburger = document.getElementById('hamburger');
  const navList   = document.getElementById('nav-links');
  const sections  = document.querySelectorAll('section[id]');

  // Scrolled class
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
    toggleBackToTop();
  }, { passive: true });

  // Active link highlight
  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  // Mobile hamburger
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navList.classList.toggle('open');
  });

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navList.classList.remove('open');
    });
  });
})();


/* ============================================================
   4. SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navHeight = document.getElementById('navbar').offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ============================================================
   5. SCROLL-REVEAL (FADE-IN)
   ============================================================ */
(function initFadeIn() {
  const targets = [
    '.section-header',
    '.about-image-wrapper',
    '.about-content',
    '.skill-category',
    '.project-card',
    '.timeline-item',
    '.cert-card',
    '.contact-info',
    '.contact-form',
    '.stat-item'
  ];

  const elements = document.querySelectorAll(targets.join(','));
  elements.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay based on sibling index
        const siblings = entry.target.parentElement
          ? Array.from(entry.target.parentElement.children)
          : [];
        const idx = siblings.indexOf(entry.target);
        const delay = idx >= 0 ? idx * 80 : 0;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();


/* ============================================================
   6. SKILL BAR ANIMATION
   ============================================================ */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill  = entry.target;
        const width = fill.getAttribute('data-width');
        // Small delay for visual appeal
        setTimeout(() => {
          fill.style.width = `${width}%`;
        }, 200);
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => observer.observe(fill));
})();


/* ============================================================
   7. STATS COUNTER ANIMATION
   ============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1500;
        const step   = Math.ceil(target / (duration / 20));
        let current  = 0;

        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current;
          if (current >= target) clearInterval(timer);
        }, 20);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();


/* ============================================================
   8. TERMINAL TYPEWRITER EFFECT
   ============================================================ */
(function initTerminal() {
  const body = document.getElementById('terminal-body');
  if (!body) return;

  const lines = body.querySelectorAll('.terminal-line, .terminal-output');
  lines.forEach(line => {
    line.style.opacity = '0';
    line.style.transition = 'opacity 0.3s ease';
  });

  let delay = 400;
  lines.forEach(line => {
    setTimeout(() => {
      line.style.opacity = '1';
    }, delay);
    delay += 280;
  });
})();


/* ============================================================
   9. BACK TO TOP BUTTON
   ============================================================ */
function toggleBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  if (window.scrollY > 400) {
    btn.classList.add('visible');
  } else {
    btn.classList.remove('visible');
  }
}

const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ============================================================
   10. CONTACT FORM — CLIENT-SIDE HANDLING
   ============================================================ */
(function initContactForm() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    // Basic validation
    if (!name || !email || !message) {
      showStatus('error', '✖ Please fill in all required fields.');
      return;
    }

    if (!isValidEmail(email)) {
      showStatus('error', '✖ Please enter a valid email address.');
      return;
    }

    // Simulate sending (replace with real backend / EmailJS / Formspree)
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    setTimeout(() => {
      showStatus('success', '✔ Message sent! I\'ll get back to you soon.');
      form.reset();
      btn.disabled = false;
      btn.innerHTML = originalText;
      setTimeout(() => { status.textContent = ''; status.className = 'form-status'; }, 5000);
    }, 1500);
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showStatus(type, msg) {
    status.textContent = msg;
    status.className   = `form-status ${type}`;
  }
})();


/* ============================================================
   11. PROJECT CARD HOVER GLOW
   ============================================================ */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.setProperty('--mx', `${x}%`);
    card.style.setProperty('--my', `${y}%`);
  });
});


/* ============================================================
   12. ACTIVE NAV ON PAGE LOAD
   ============================================================ */
window.addEventListener('load', () => {
  // Trigger scroll handler once to set initial active state
  window.dispatchEvent(new Event('scroll'));

  // Animate hero content in
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(20px)';
    heroContent.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
    requestAnimationFrame(() => {
      setTimeout(() => {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
      }, 200);
    });
  }

  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    heroVisual.style.opacity = '0';
    heroVisual.style.transform = 'translateX(20px)';
    heroVisual.style.transition = 'opacity 0.9s ease 0.4s, transform 0.9s ease 0.4s';
    requestAnimationFrame(() => {
      setTimeout(() => {
        heroVisual.style.opacity = '1';
        heroVisual.style.transform = 'translateX(0)';
      }, 300);
    });
  }
});


/* ============================================================
   13. SKILL CARD GLOW ON HOVER (dynamic accent)
   ============================================================ */
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.2)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
  });
});


/* ============================================================
   14. CERTIFICATE CARD ANIMATE IN
   ============================================================ */
(function initCertCards() {
  const cards = document.querySelectorAll('.cert-card');
  cards.forEach((card, i) => {
    card.style.transition = `transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, opacity 0.5s ease ${i * 0.1}s`;
  });
})();
