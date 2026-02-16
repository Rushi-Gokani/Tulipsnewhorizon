
document.querySelectorAll('[data-mega-menu-side-nav]').forEach(menu => {
  const categoryLinks = menu.querySelectorAll('[data-category-link]');
  const contents = menu.querySelectorAll('[data-category-content]');

  categoryLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const parent = link.closest('.mega-menu-side-nav__item');
      if (!parent) return;
      const handle = parent.getAttribute('data-handle');

      // Update links
      categoryLinks.forEach(l => l.classList.remove('is-active'));
      link.classList.add('is-active');

      // Update contents
      contents.forEach(content => {
        if (content.getAttribute('data-category-content') === handle) {
          content.classList.add('is-active');
        } else {
          content.classList.remove('is-active');
        }
      });
    });
  });
});
