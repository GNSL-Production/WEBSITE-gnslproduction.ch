// ── Breakpoint reload ─────────────────────────────────────────
let lastWidth = window.innerWidth;
window.addEventListener('resize', () => {
  const w = window.innerWidth;
  if ((lastWidth <= 1080 && w > 1080) || (lastWidth > 1080 && w <= 1080)) {
    location.reload();
  }
  lastWidth = w;
});

// ── Refs ──────────────────────────────────────────────────────
const navEl        = document.getElementById('nav');
const navBrand     = document.getElementById('navBrand');
const burgerBtn    = document.querySelector('.burger-menu');
const menuDrawer   = document.querySelector('.menu-dropdown');
const navLinksBox  = document.getElementById('btnBlock');
const capsule      = document.getElementById('capsule');
const navLinks     = document.querySelectorAll('.btnNav');
const heroBg       = document.querySelector('.bgBlur');
const sections     = document.querySelectorAll('section[id]');

// ── Nav: scrolled class ───────────────────────────────────────
window.addEventListener('scroll', () => {
  navEl.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ── Nav brand: reload ─────────────────────────────────────────
navBrand.addEventListener('click', () => location.reload());

// ── Capsule: follow active nav link ──────────────────────────
function moveCapsule(el) {
  capsule.style.left  = el.offsetLeft + 'px';
  capsule.style.width = el.offsetWidth + 'px';
}

window.onload = () => {
  capsule.style.transition = 'none';
  const hash      = window.location.hash;
  let active      = [...navLinks].find(l => l.getAttribute('href') === hash) || navLinks[0];

  navLinks.forEach(l => l.classList.remove('active'));
  active.classList.add('active');
  moveCapsule(active);

  // sync dropdown too
  document.querySelectorAll('.menu-dropdown .btnNav').forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === active.getAttribute('href'));
  });

  setTimeout(() => { capsule.style.transition = ''; }, 50);
};

// ── Active section detection on scroll ────────────────────────
function syncActiveSection() {
  let current = '';
  sections.forEach(s => {
    const r = s.getBoundingClientRect();
    if (r.top <= window.innerHeight / 2 && r.bottom > window.innerHeight / 2) current = s.id;
  });
  if (!current) return;

  const href = `#${current}`;
  document.querySelectorAll('.btnNav').forEach(l => {
    const on = l.getAttribute('href') === href;
    l.classList.toggle('active', on);
    if (on && l.closest('#btnBlock')) moveCapsule(l);
  });
  if (window.location.hash !== href) history.replaceState(null, null, href);
}
window.addEventListener('scroll', syncActiveSection, { passive: true });

// ── Burger / drawer ───────────────────────────────────────────
burgerBtn.addEventListener('click', toggleDrawer);

function toggleDrawer() {
  burgerBtn.classList.toggle('burger-menu-open');
  menuDrawer.classList.toggle('active');
  document.body.style.overflow = menuDrawer.classList.contains('active') ? 'hidden' : '';
}

// Populate drawer with cloned nav links
menuDrawer.innerHTML = '';
navLinks.forEach(link => {
  const clone = link.cloneNode(true);
  clone.onclick = () => {
    document.querySelectorAll('.menu-dropdown .btnNav').forEach(l => l.classList.remove('active'));
    clone.classList.add('active');
    toggleDrawer();
  };
  menuDrawer.appendChild(clone);
});

// ── Hero background blur on scroll ────────────────────────────
window.addEventListener('scroll', () => {
  if (!heroBg) return;
  const blur = Math.min((window.scrollY / 600) * 20, 20);
  heroBg.style.filter = `brightness(.18) saturate(.6) blur(${blur}px)`;
}, { passive: true });

// ── Service / bento cards: glowing circle cursor ──────────────
document.querySelectorAll('.service').forEach(card => {
  const gradient = `linear-gradient(${Math.floor(Math.random() * 360)}deg, rgba(61,82,192,.35) 0%, rgba(10,10,24,.6) 55%)`;
  card.style.background = gradient;

  if (window.innerWidth <= 1080) return;

  const circle = card.querySelector('.circle');
  if (!circle) return;

  card.addEventListener('mousemove', e => {
    circle.style.left      = `${e.clientX}px`;
    circle.style.top       = `${e.clientY}px`;
    circle.style.transform = 'translate(-50%,-50%) scale(1)';
  });
  card.addEventListener('mouseleave', () => {
    circle.style.transform = 'translate(-50%,-50%) scale(0)';
  });
});

// ── Glow effect on .btn elements ─────────────────────────────
if (window.innerWidth > 1080) {
  document.querySelectorAll('.btn').forEach(btn => {
    const glow = document.createElement('div');
    glow.className = 'glow';
    btn.appendChild(glow);

    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(btn.offsetWidth, btn.offsetHeight) * 1.5;
      glow.style.width      = `${size}px`;
      glow.style.height     = `${size}px`;
      glow.style.left       = `${e.clientX - rect.left}px`;
      glow.style.top        = `${e.clientY - rect.top}px`;
      glow.style.opacity    = '1';
      glow.style.visibility = 'visible';
    });
    btn.addEventListener('mouseleave', () => {
      glow.style.opacity    = '0';
      glow.style.visibility = 'hidden';
    });
  });
}


// ── Contact form → mailto ─────────────────────────────────────
const subjectEl = document.querySelector('.inputSubject');
const messageEl = document.querySelector('.textInput');
const sendBtn   = document.querySelector('.btnContact');

if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    const subject = subjectEl?.value.trim() || '';
    const message = messageEl?.value.trim() || '';
    if (!subject || !message) {
      alert("Merci de remplir l'objet et le message avant d'envoyer.");
      return;
    }
    window.location.href =
      `mailto:contact@gnslproduction.ch?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  });
}

// ── Scroll reveal (Intersection Observer) ─────────────────────
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = +entry.target.dataset.delay || 0;
    setTimeout(() => entry.target.classList.add('visible'), delay);
    io.unobserve(entry.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Stagger children in grid containers
document.querySelectorAll('.feat-grid, .pricing-grid, .delivery-grid').forEach(grid => {
  [...grid.children].forEach((child, i) => {
    if (!child.classList.contains('reveal')) {
      child.classList.add('reveal');
      child.dataset.delay = String(i * 90);
      io.observe(child);
    }
  });
});
