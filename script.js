const dialog = document.querySelector('#video-dialog');
const player = document.querySelector('#dialog-player');
const dialogTitle = document.querySelector('#dialog-title');
const openFile = document.querySelector('#dialog-open-file');
const closeButton = document.querySelector('.dialog-close');
let activePreview = null;

function stopPreview() {
  if (!activePreview) return;
  const { container, video } = activePreview;
  video.pause();
  container.classList.remove('is-previewing');
  activePreview = null;
}

document.querySelectorAll('.video-link').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (!dialog?.showModal || !player) return;
    event.preventDefault();
    stopPreview();
    dialogTitle.textContent = link.dataset.title || 'Project video';
    openFile.href = link.href;
    player.poster = link.dataset.poster || '';
    player.src = link.href;
    player.load();
    dialog.showModal();
    document.body.classList.add('dialog-open');
    player.play().catch(() => {
      // The controls remain available when a browser blocks automatic play.
    });
  });
});

closeButton?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', (event) => {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog?.addEventListener('close', () => {
  player.pause();
  player.removeAttribute('src');
  player.load();
  document.body.classList.remove('dialog-open');
});

const canPreview = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  && !navigator.connection?.saveData;

if (canPreview) {
  const previewObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.target === activePreview?.container && !entry.isIntersecting)) stopPreview();
    }, { threshold: 0 })
    : null;
  document.querySelectorAll('.project-visual[data-preview]').forEach((container) => {
    const video = container.querySelector('.hover-preview');
    if (!video) return;
    previewObserver?.observe(container);
    container.addEventListener('pointerenter', () => {
      if (dialog?.open) return;
      stopPreview();
      if (!video.src) video.src = container.dataset.preview;
      activePreview = { container, video };
      video.play().then(() => container.classList.add('is-previewing')).catch(() => stopPreview());
    });
    container.addEventListener('pointerleave', stopPreview);
  });
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopPreview();
});

const progress = document.querySelector('.scroll-progress');
let scrollTicking = false;
function updateProgress() {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${available > 0 ? window.scrollY / available : 0})`;
  scrollTicking = false;
}
window.addEventListener('scroll', () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(updateProgress);
}, { passive: true });
updateProgress();

const navLinks = [...document.querySelectorAll('.main-nav a')];
const watchedSections = ['work', 'systems', 'approach', 'archive']
  .map((id) => document.getElementById(id))
  .filter(Boolean);
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach((link) => {
      const active = link.hash === `#${visible.target.id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-20% 0px -60% 0px', threshold: [0, .1, .25] });
  watchedSections.forEach((section) => sectionObserver.observe(section));
}

document.querySelector('#year').textContent = String(new Date().getFullYear());
