class ProjectModal extends HTMLElement {
  connectedCallback() {
    if (this.dialog) return;
    this.innerHTML = '<dialog class="project-dialog" aria-labelledby="project-dialog-title"></dialog>';
    this.dialog = this.querySelector('dialog');
    this.dialog.addEventListener('click', event => {
      if (event.target === this.dialog || event.target.closest('.project-dialog-close')) this.close();
    });
  }

  escape(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
  }

  open(project) {
    if (!project || !this.dialog) return;
    const esc = value => this.escape(value);
    this.dialog.innerHTML = `<div class="project-dialog-inner"><p class="eyebrow">${esc(project.categoryLabel || project.category || 'PROJECT')} · ${esc(project.projectType || '')}</p><h2 id="project-dialog-title">${esc(project.title)}</h2><p class="project-dialog-summary">${esc(project.summary || '')}</p>${project.context ? `<section><h3>Context</h3><p>${esc(project.context)}</p></section>` : ''}${project.approach ? `<section><h3>Approach</h3><p>${esc(project.approach)}</p></section>` : ''}${project.deliverables?.length ? `<section><h3>Deliverables</h3><ul>${project.deliverables.map(item => `<li>${esc(item)}</li>`).join('')}</ul></section>` : ''}${project.tools?.length ? `<section><h3>Tools</h3><div class="project-dialog-tools">${project.tools.map(item => `<span>${esc(item)}</span>`).join('')}</div></section>` : ''}${project.disclaimer ? `<p class="project-dialog-note">${esc(project.disclaimer)}</p>` : ''}<div class="project-dialog-actions">${project.liveUrl ? `<a class="project-visit" href="${esc(project.liveUrl)}" target="_blank" rel="noopener noreferrer">Visit live</a>` : ''}<button class="project-dialog-close button-secondary" type="button">Close</button></div></div>`;
    this.dialog.showModal();
    this.dialog.querySelector('.project-dialog-close').focus();
  }

  close() {
    if (this.dialog?.open) this.dialog.close();
  }
}

customElements.define('project-modal', ProjectModal);
