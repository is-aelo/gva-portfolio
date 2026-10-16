(() => {
  const selector = [
    'main > section:not(.hero)',
    '.service-group',
    '.project-card',
    '.step',
    '.strength-card',
    '.timeline',
    '.skillgroup'
  ].join(',');

  window.initScrollReveal = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

    const elements = [...document.querySelectorAll(selector)];
    if (!elements.length) return;

    const siblingIndexes = new Map();
    elements.forEach(element => {
      const parent = element.parentElement;
      const index = siblingIndexes.get(parent) || 0;
      siblingIndexes.set(parent, index + 1);
      element.dataset.reveal = '';
      element.style.setProperty('--reveal-delay', `${Math.min(index * 75, 300)}ms`);
    });

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

    elements.forEach(element => observer.observe(element));
    document.documentElement.classList.add('scroll-reveal-ready');
  };
})();
