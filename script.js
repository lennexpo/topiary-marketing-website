// =============================
// TOPIARY MARKETING — script.js
// =============================

document.addEventListener('DOMContentLoaded', () => {

  // =============================
  // NAVBAR SCROLL
  // =============================
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // =============================
  // HAMBURGER MENU
  // =============================
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  function openMenu() {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }

  hamburger.addEventListener('click', openMenu);
  mobileClose.addEventListener('click', closeMenu);
  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  // =============================
  // SMOOTH SCROLL
  // =============================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // =============================
  // TESTIMONIAL SLIDER
  // =============================
  const track = document.getElementById('sliderTrack');
  const dotsContainer = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (track) {
    const cards = track.querySelectorAll('.testimonial-card');
    let current = 0;
    const total = cards.length;

    cards.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    let auto = setInterval(() => goTo(current + 1), 5000);
    track.parentElement.addEventListener('mouseenter', () => clearInterval(auto));
    track.parentElement.addEventListener('mouseleave', () => {
      auto = setInterval(() => goTo(current + 1), 5000);
    });

    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? goTo(current + 1) : goTo(current - 1);
    });
  }

  // =============================
  // CONTACT FORM — Web3Forms
  // =============================
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      const name    = document.getElementById('nameInput').value.trim();
      const email   = document.getElementById('emailInput').value.trim();
      const phone   = document.getElementById('phoneInput').value.trim();
      const service = document.getElementById('serviceInput').value;
      const message = document.getElementById('messageInput').value.trim();

      if (!name || !email || !message) {
        formStatus.textContent = 'Please fill in your name, email, and message.';
        formStatus.className = 'form-status error';
        return;
      }
      if (!email.includes('@') || !email.includes('.')) {
        formStatus.textContent = 'Please enter a valid email address.';
        formStatus.className = 'form-status error';
        return;
      }

      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      formStatus.textContent = '';
      formStatus.className = 'form-status';

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: 'd4f37dc3-ade3-4680-9ef6-478c8f6a9f61',
            subject: `New Enquiry from ${name} — Topiary Marketing`,
            from_name: 'Topiary Marketing Website',
            name,
            email,
            replyto: email,
            phone: phone || 'Not provided',
            service_type: service || 'Not specified',
            message,
          })
        });

        const data = await res.json();

        if (data.success) {
          formStatus.textContent = "✓ Enquiry sent! We'll get back to you shortly.";
          formStatus.className = 'form-status success';
          document.getElementById('nameInput').value = '';
          document.getElementById('emailInput').value = '';
          document.getElementById('phoneInput').value = '';
          document.getElementById('serviceInput').value = '';
          document.getElementById('messageInput').value = '';
        } else {
          formStatus.textContent = 'Something went wrong. Please call us directly.';
          formStatus.className = 'form-status error';
        }
      } catch {
        formStatus.textContent = 'Network error. Please call us on +263 772 338 862.';
        formStatus.className = 'form-status error';
      }

      submitBtn.textContent = 'Send Enquiry →';
      submitBtn.disabled = false;
    });
  }

  // =============================
  // ACTIVE NAV ON SCROLL
  // =============================
  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  const activeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === '#' + entry.target.id;
          link.style.color = isActive ? 'var(--blue)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => activeObserver.observe(s));

});
