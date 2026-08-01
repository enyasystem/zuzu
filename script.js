const body = document.body;
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const themeToggles = document.querySelectorAll('.theme-toggle');
const lightbox = document.querySelector('.lightbox');
const backToTop = document.querySelector('.back-to-top');
const galleryItems = [...document.querySelectorAll('.gallery-item')];
let currentGalleryIndex = 0;

menuToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

window.addEventListener('scroll', () => {
  document.querySelector('.site-header').classList.toggle('scrolled', window.scrollY > 20);
  backToTop.classList.toggle('visible', window.scrollY > 600);
}, { passive: true });

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

themeToggles.forEach((themeToggle) => themeToggle.addEventListener('click', () => {
  const isDark = body.classList.toggle('dark');
  themeToggles.forEach((toggle) => {
    toggle.querySelector('.theme-icon').textContent = isDark ? '☾' : '☼';
    toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  });
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

document.querySelectorAll('.filter-button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter-button').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.gallery-item').forEach((item) => {
      const show = filter === 'all' || item.dataset.category.includes(filter);
      item.classList.toggle('is-hidden', !show);
    });
  });
});

const showGalleryImage = (index) => {
  const item = galleryItems[index];
  currentGalleryIndex = index;
  lightbox.querySelector('img').src = item.dataset.full;
  lightbox.querySelector('img').alt = item.querySelector('img').alt;
  lightbox.querySelector('p').textContent = item.dataset.title;
};

galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    showGalleryImage(index);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
  });
});

const moveGallery = (direction) => showGalleryImage((currentGalleryIndex + direction + galleryItems.length) % galleryItems.length);
lightbox.querySelector('.lightbox-prev').addEventListener('click', () => moveGallery(-1));
lightbox.querySelector('.lightbox-next').addEventListener('click', () => moveGallery(1));

const closeLightbox = () => {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');
};
lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeLightbox(); if (event.key === 'ArrowLeft') moveGallery(-1); if (event.key === 'ArrowRight') moveGallery(1); });

let touchStartX = 0;
lightbox.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
lightbox.addEventListener('touchend', (event) => {
  const distance = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(distance) > 45) moveGallery(distance > 0 ? -1 : 1);
}, { passive: true });

const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach((section) => sectionObserver.observe(section));

document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#contact-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const message = `Hello Zuzu, my name is ${data.get('name')}. My email is ${data.get('email')}.\n\n${data.get('message')}`;
  window.open(`https://wa.me/2347032845816?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  form.querySelector('.form-note').textContent = 'Opening WhatsApp…';
});
