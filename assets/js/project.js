// Portfolio showcase: slideshow, activity viewer, gallery modal, lightbox.
// Vanilla JS, tanpa library.
(function () {
  'use strict';

  // Slideshow (project card TOKOTOKI). Auto 4 detik, pause saat hover/fokus.
  document.querySelectorAll('[data-slideshow]').forEach((root) => {
    const track = root.querySelector('[data-slideshow-track]');
    const slides = [...root.querySelectorAll('[data-slide]')];
    const dots = [...root.querySelectorAll('[data-dot]')];
    const prev = root.querySelector('[data-prev]');
    const next = root.querySelector('[data-next]');
    if (!track || slides.length < 2) return;

    let index = 0;
    let timer = null;
    const delay = Number(root.dataset.slideshowDelay || 4000);

    const show = (i) => {
      index = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + index * 100 + '%)';
      dots.forEach((dot, d) => dot.setAttribute('aria-current', String(d === index)));
      slides.forEach((slide, s) => slide.setAttribute('aria-hidden', String(s !== index)));
    };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const start = () => { stop(); timer = setInterval(() => show(index + 1), delay); };

    prev?.addEventListener('click', () => { show(index - 1); start(); });
    next?.addEventListener('click', () => { show(index + 1); start(); });
    dots.forEach((dot, d) => dot.addEventListener('click', () => { show(d); start(); }));
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);

    show(0);
    start();
  });

  // Lightbox. Mendukung navigasi antar gambar dalam satu grup
  // (data-lightbox-group yang sama). Tanpa grup = mode satu gambar.
  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImg = lightbox?.querySelector('[data-lightbox-img]');
  const lightboxCaption = lightbox?.querySelector('[data-lightbox-caption]');
  const lightboxClose = lightbox?.querySelector('[data-lightbox-close]');
  const lightboxPrev = lightbox?.querySelector('[data-lightbox-prev]');
  const lightboxNext = lightbox?.querySelector('[data-lightbox-next]');
  const triggers = [...document.querySelectorAll('[data-lightbox-src]')];
  let lastFocus = null;
  let groupItems = [];
  let groupIndex = 0;

  const render = () => {
    const item = groupItems[groupIndex];
    if (!item || !lightboxImg) return;
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    if (lightboxCaption) lightboxCaption.textContent = item.caption || item.alt;
    const multi = groupItems.length > 1;
    if (lightboxPrev) lightboxPrev.hidden = !multi;
    if (lightboxNext) lightboxNext.hidden = !multi;
  };
  const openLightbox = (startEl) => {
    const group = startEl.dataset.lightboxGroup || '';
    const scope = group
      ? [...document.querySelectorAll('[data-lightbox-src]')].filter((el) => el.dataset.lightboxGroup === group)
      : [startEl];
    groupItems = scope.map(readItem);
    const startSrc = startEl.dataset.lightboxSrc || '';
    groupIndex = Math.max(0, groupItems.findIndex((item) => item.src === startSrc));
    lastFocus = document.activeElement;
    lightbox?.classList.add('open');
    document.body.style.overflow = 'hidden';
    render();
    lightboxClose?.focus();
  };
  const readItem = (el) => ({
    src: el.dataset.lightboxSrc || '',
    alt: el.dataset.lightboxAlt || '',
    caption: el.dataset.lightboxCaption || '',
  });
  const closeLightbox = () => {
    lightbox?.classList.remove('open');
    document.body.style.overflow = '';
    lightboxImg?.removeAttribute('src');
    groupItems = [];
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };
  const step = (dir) => {
    if (groupItems.length < 2) return;
    groupIndex = (groupIndex + dir + groupItems.length) % groupItems.length;
    render();
  };

  triggers.forEach((el) => {
    el.addEventListener('click', () => openLightbox(el));
  });
  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click', () => step(-1));
  lightboxNext?.addEventListener('click', () => step(1));
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  // Viewer Kegiatan: satu foto besar + dots + thumbnails + counter.
  document.querySelectorAll('[data-activity-viewer]').forEach((viewer) => {
    const slides = [...viewer.querySelectorAll('[data-activity-slide]')];
    const dotsWrap = viewer.querySelector('[data-activity-dots]');
    const thumbsWrap = viewer.parentElement?.querySelector('[data-activity-thumbs]');
    const counter = viewer.parentElement?.querySelector('[data-activity-counter]');
    const prev = viewer.parentElement?.querySelector('[data-activity-prev]');
    const next = viewer.parentElement?.querySelector('[data-activity-next]');
    if (!slides.length) return;
    viewer.classList.add('js');

    let index = 0;
    const show = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((slide, s) => slide.classList.toggle('active', s === index));
      dotsWrap?.querySelectorAll('button').forEach((dot, d) => dot.setAttribute('aria-current', String(d === index)));
      thumbsWrap?.querySelectorAll('button').forEach((thumb, t) => thumb.setAttribute('aria-current', String(t === index)));
      if (counter) counter.textContent = (index + 1) + ' / ' + slides.length;
    };

    if (dotsWrap) {
      slides.forEach((slide, s) => {
        const li = document.createElement('li');
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Ke foto ' + (s + 1) + ': ' + (slide.dataset.activityTitle || ''));
        dot.setAttribute('aria-current', 'false');
        dot.addEventListener('click', () => show(s));
        li.appendChild(dot);
        dotsWrap.appendChild(li);
      });
    }
    if (thumbsWrap) {
      slides.forEach((slide, s) => {
        const img = slide.querySelector('img');
        const thumb = document.createElement('button');
        thumb.type = 'button';
        thumb.setAttribute('aria-label', 'Lihat ' + (slide.dataset.activityTitle || ('foto ' + (s + 1))));
        thumb.setAttribute('aria-current', 'false');
        const thumbImg = document.createElement('img');
        thumbImg.src = img?.src || '';
        thumbImg.alt = '';
        thumbImg.loading = 'lazy';
        thumb.appendChild(thumbImg);
        thumb.addEventListener('click', () => show(s));
        thumbsWrap.appendChild(thumb);
      });
    }

    prev?.addEventListener('click', () => show(index - 1));
    next?.addEventListener('click', () => show(index + 1));
    show(0);
  });

  // Modal gallery "Lihat Semua Dokumentasi": grid dibangun dari slide viewer.
  const galleryModal = document.querySelector('[data-gallery-modal]');
  const galleryGrid = galleryModal?.querySelector('[data-gallery-grid]');
  const galleryClose = galleryModal?.querySelector('[data-gallery-close]');
  let galleryLastFocus = null;

  const openGallery = () => {
    if (!galleryModal || !galleryGrid) return;
    if (!galleryGrid.hasChildNodes()) {
      document.querySelectorAll('[data-activity-slide]').forEach((slide) => {
        const img = slide.querySelector('img');
        if (!img) return;
        const item = document.createElement('button');
        item.type = 'button';
        item.dataset.lightboxSrc = img.src;
        item.dataset.lightboxAlt = img.alt;
        item.dataset.lightboxCaption = slide.dataset.activityTitle || img.alt;
        item.dataset.lightboxGroup = 'kegiatan';
        item.setAttribute('aria-label', 'Perbesar: ' + (slide.dataset.activityTitle || img.alt));
        const thumb = document.createElement('img');
        thumb.src = img.src;
        thumb.alt = '';
        thumb.loading = 'lazy';
        item.appendChild(thumb);
        item.addEventListener('click', () => { closeGallery(); openLightbox(item); });
        galleryGrid.appendChild(item);
      });
    }
    galleryLastFocus = document.activeElement;
    galleryModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    galleryClose?.focus();
  };
  const closeGallery = () => {
    galleryModal?.classList.remove('open');
    document.body.style.overflow = '';
    if (galleryLastFocus && galleryLastFocus.focus) galleryLastFocus.focus();
  };

  document.querySelectorAll('[data-open-gallery]').forEach((btn) => {
    btn.addEventListener('click', openGallery);
  });
  galleryClose?.addEventListener('click', closeGallery);
  galleryModal?.addEventListener('click', (e) => { if (e.target === galleryModal) closeGallery(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && galleryModal?.classList.contains('open')) closeGallery();
  });
})();
