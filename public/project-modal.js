class ProjectModal extends HTMLElement {
  connectedCallback() {
    if (this.dialog) return;
    this.innerHTML = '<dialog class="project-dialog" aria-labelledby="project-dialog-title"></dialog>';
    this.dialog = this.querySelector('dialog');
    this.dialog.addEventListener('click', event => {
      if (event.target === this.dialog || event.target.closest('.project-dialog-close')) {
        this.close();
      }
    });
  }

  escape(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
  }

  getGallery(project) {
    const galleryImages = Array.isArray(project.gallery) ? project.gallery.filter(Boolean) : [];
    return galleryImages.length ? galleryImages : (project.coverImage || project.imageUrl ? [project.coverImage || project.imageUrl] : []);
  }

  open(project) {
    if (!project || !this.dialog) return;
    const esc = value => this.escape(value);
    const galleryImages = this.getGallery(project);
    const currentImage = galleryImages[0] || project.coverImage || project.imageUrl || '';
    const mediaHtml = currentImage ? `<div class="project-dialog-media"><img src="${esc(currentImage)}" alt="${esc(project.altText || project.title)}" loading="lazy"></div>` : '';
    this.dialog.innerHTML = `<div class="project-dialog-inner"><h2 id="project-dialog-title">${esc(project.title)}</h2>${mediaHtml}<p class="project-dialog-summary">${esc(project.summary || '')}</p>${project.context ? `<section><h3>Context</h3><p>${esc(project.context)}</p></section>` : ''}${project.approach ? `<section><h3>Approach</h3><p>${esc(project.approach)}</p></section>` : ''}${project.deliverables?.length ? `<section><h3>Deliverables</h3><ul>${project.deliverables.map(item => `<li>${esc(item)}</li>`).join('')}</ul></section>` : ''}${project.tools?.length ? `<section><h3>Tools</h3><div class="project-dialog-tools">${project.tools.map(item => `<span>${esc(item)}</span>`).join('')}</div></section>` : ''}${project.disclaimer ? `<p class="project-dialog-note">${esc(project.disclaimer)}</p>` : ''}<div class="project-dialog-actions">${project.liveUrl ? `<a class="project-visit" href="${esc(project.liveUrl)}" target="_blank" rel="noopener noreferrer">Visit live</a>` : ''}<button class="project-dialog-close button-secondary" type="button">Close</button></div></div>`;
    this.dialog.showModal();
    this.dialog.querySelector('.project-dialog-close')?.focus();
  }

  close() {
    if (this.dialog?.open) this.dialog.close();
  }
}

class PosterModal extends HTMLElement {
  connectedCallback() {
    if (this.dialog) return;
    this.innerHTML = '<dialog class="poster-dialog" aria-label="Poster preview"></dialog>';
    this.dialog = this.querySelector('dialog');
    this.dialog.addEventListener('click', event => {
      if (event.target === this.dialog || event.target.closest('.poster-dialog-close')) {
        this.close();
      }
    });
  }

  escape(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
  }

  open(image, label) {
    if (!image || !this.dialog) return;
    const esc = value => this.escape(value);
    this.dialog.innerHTML = `<div class="poster-dialog-inner"><div class="poster-dialog-toolbar"><button class="project-dialog-zoom" type="button" data-zoom="out" aria-label="Zoom out">−</button><button class="project-dialog-zoom project-dialog-zoom--reset" type="button" data-zoom="reset" aria-label="Reset zoom">100%</button><button class="project-dialog-zoom" type="button" data-zoom="in" aria-label="Zoom in">＋</button></div><div class="poster-dialog-frame"><img class="poster-dialog-image" src="${esc(image)}" alt="${esc(label || 'Poster image')}" loading="eager"></div><div class="project-dialog-actions project-dialog-actions--poster"><button class="poster-dialog-close button-secondary" type="button">Close</button></div></div>`;
    this.dialog.showModal();

    const imageEl = this.dialog.querySelector('.poster-dialog-image');
    const frameEl = this.dialog.querySelector('.poster-dialog-frame');
    const resetButton = this.dialog.querySelector('[data-zoom="reset"]');
    let zoom = 1;
    let dragStartX = 0;
    let dragStartY = 0;
    let offsetX = 0;
    let offsetY = 0;
    let dragging = false;
    let rafId = null;

    const clampOffset = () => {
      const frameWidth = frameEl.clientWidth;
      const frameHeight = frameEl.clientHeight;
      const scaledWidth = imageEl.clientWidth * zoom;
      const scaledHeight = imageEl.clientHeight * zoom;
      const maxX = Math.max(0, (scaledWidth - frameWidth) / 2);
      const maxY = Math.max(0, (scaledHeight - frameHeight) / 2);
      offsetX = Math.min(maxX, Math.max(-maxX, offsetX));
      offsetY = Math.min(maxY, Math.max(-maxY, offsetY));
    };

    const renderTransform = () => {
      imageEl.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`;
      rafId = null;
    };

    const applyZoom = value => {
      zoom = Math.min(2.4, Math.max(0.8, value));
      clampOffset();
      if (rafId === null) {
        rafId = requestAnimationFrame(renderTransform);
      }
      if (resetButton) resetButton.textContent = `${Math.round(zoom * 100)}%`;
    };

    this.dialog.querySelectorAll('[data-zoom]').forEach(button => {
      button.addEventListener('click', () => {
        const action = button.dataset.zoom;
        if (action === 'in') applyZoom(zoom + 0.2);
        if (action === 'out') applyZoom(zoom - 0.2);
        if (action === 'reset') { offsetX = 0; offsetY = 0; applyZoom(1); }
      });
    });

    const onPointerDown = event => {
      if (zoom <= 1) return;
      dragging = true;
      dragStartX = event.clientX - offsetX;
      dragStartY = event.clientY - offsetY;
      imageEl.style.cursor = 'grabbing';
      imageEl.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    };

    const onPointerMove = event => {
      if (!dragging || zoom <= 1) return;
      offsetX = event.clientX - dragStartX;
      offsetY = event.clientY - dragStartY;
      clampOffset();
      if (rafId === null) {
        rafId = requestAnimationFrame(renderTransform);
      }
    };

    const onPointerUp = () => {
      dragging = false;
      imageEl.style.cursor = 'grab';
      imageEl.style.transition = 'transform .14s ease';
      setTimeout(() => {
        imageEl.style.transition = 'transform .18s ease';
      }, 140);
    };

    imageEl.style.cursor = 'grab';
    imageEl.style.transition = 'transform .18s ease';
    imageEl.style.touchAction = 'none';
    imageEl.style.userSelect = 'none';
    frameEl.style.touchAction = 'none';
    imageEl.addEventListener('pointerdown', onPointerDown);
    imageEl.addEventListener('pointermove', onPointerMove);
    imageEl.addEventListener('pointerup', onPointerUp);
    imageEl.addEventListener('pointercancel', onPointerUp);
    imageEl.addEventListener('pointerleave', onPointerUp);
    frameEl.addEventListener('pointerup', onPointerUp);
    frameEl.addEventListener('pointercancel', onPointerUp);
    applyZoom(1);
    this.dialog.querySelector('.poster-dialog-close')?.focus();
  }

  close() {
    if (this.dialog?.open) this.dialog.close();
  }
}

customElements.define('project-modal', ProjectModal);
customElements.define('poster-modal', PosterModal);
