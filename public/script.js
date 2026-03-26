// Mobile menu
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
}

// Smooth scroll for internal links
navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href?.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      nav.classList.remove('active');
    }
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href');
    if (id && id !== '#') {
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Reveal on scroll
const revealables = [...document.querySelectorAll('.card, .step, .testimonial-card, .driver-card, .contact-form, .about, .how, .benefits')];
revealables.forEach((el) => el.classList.add('reveal'));
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });
revealables.forEach((el) => observer.observe(el));

// Fetch testimonials
async function loadTestimonials() {
  const grid = document.getElementById('testimonialsGrid');
  if (!grid) return;
  try {
    const res = await fetch('/api/depoimentos');
    if (!res.ok) throw new Error('Falha ao carregar');
    const data = await res.json();
    if (!Array.isArray(data) || !data.length) throw new Error('Sem depoimentos');
    grid.innerHTML = '';
    data.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'testimonial-card reveal';
      card.innerHTML = `
        <div class="name">${item.nome}</div>
        <div class="stars">${'?'.repeat(item.avaliacao || 5)}</div>
        <p class="muted">${item.comentario}</p>
      `;
      grid.appendChild(card);
      observer.observe(card);
    });
  } catch (err) {
    grid.innerHTML = '<p class="muted">Não foi possível carregar depoimentos agora.</p>';
  }
}
loadTestimonials();

// Contact form submission
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = 'Enviando...';
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    try {
      const res = await fetch('/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Erro ao enviar');
      statusEl.textContent = 'Mensagem enviada com sucesso!';
      statusEl.style.color = '#6ee7b7';
      form.reset();
    } catch (err) {
      statusEl.textContent = 'Não foi possível enviar agora. Tente novamente.';
      statusEl.style.color = '#f87171';
    }
  });
}
