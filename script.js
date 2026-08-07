// ---------- Scroll progress bar ----------
const scrollBar = document.getElementById('scrollBar');
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateScrollProgress);
updateScrollProgress();

// ---------- Scroll reveal animations ----------
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach((el) => revealObserver.observe(el));

// ---------- Active nav link on scroll ----------
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-links a[data-nav]');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.dataset.nav === id);
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });
sections.forEach((section) => navObserver.observe(section));

// ---------- Expandable project details ----------
document.querySelectorAll('.details-toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    const isOpen = target.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.querySelector('.toggle-label').textContent = isOpen
      ? 'Hide technical details'
      : 'Show technical details';
  });
});

// ---------- Lightbox for gallery images ----------
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.gallery-item[data-full]').forEach((item) => {
  item.addEventListener('click', () => {
    lightboxImg.src = item.dataset.full;
    lightboxImg.alt = item.querySelector('img')?.alt || '';
    lightbox.classList.add('open');
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxImg.src = '';
}
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});
