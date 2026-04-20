class CartDrawerReviews extends HTMLElement {
  connectedCallback() {
    this.track = this.querySelector('[data-reviews-track]');
    this.prevBtn = this.querySelector('[data-reviews-prev]');
    this.nextBtn = this.querySelector('[data-reviews-next]');
    this.indicatorContainer = this.querySelector('[data-reviews-indicator]');

    if (!this.track || !this.prevBtn || !this.nextBtn) return;

    this.cards = this.querySelectorAll('[data-review-card]');
    this.cardCount = this.cards.length;

    this.prevBtn.addEventListener('click', () => this.scrollToCard(-1));
    this.nextBtn.addEventListener('click', () => this.scrollToCard(1));

    this.track.addEventListener('scroll', () => {
      this.updateNavState();
      this.updateIndicator();
    }, { passive: true });

    this.initIndicator();
    this.updateNavState();

    if (window.ResizeObserver) {
      new ResizeObserver(() => this.updateNavState()).observe(this.track);
    }
  }

  getSlideWidth() {
    const card = this.cards[0];
    if (!card) return this.track.clientWidth;
    const style = getComputedStyle(this.track);
    const gap = parseFloat(style.gap) || 12;
    return card.offsetWidth + gap;
  }

  scrollToCard(direction) {
    const { scrollLeft } = this.track;
    const slideWidth = this.getSlideWidth();
    const targetIndex = Math.round(scrollLeft / slideWidth) + direction;
    const clampedIndex = Math.max(0, Math.min(targetIndex, this.cardCount - 1));
    this.track.scrollTo({ left: clampedIndex * slideWidth, behavior: 'smooth' });
  }

  updateNavState() {
    const { scrollLeft, scrollWidth, clientWidth } = this.track;
    const threshold = 5;

    this.prevBtn.disabled = scrollLeft <= threshold;
    this.nextBtn.disabled = scrollLeft + clientWidth >= scrollWidth - threshold;
  }

  initIndicator() {
    if (!this.indicatorContainer || this.cardCount <= 1) return;

    for (let i = 0; i < this.cardCount; i++) {
      const dot = document.createElement('span');
      dot.className = 'cart-drawer-reviews__scroll-dot';
      if (i === 0) dot.classList.add('cart-drawer-reviews__scroll-dot--active');
      dot.addEventListener('click', () => {
        const slideWidth = this.getSlideWidth();
        this.track.scrollTo({ left: i * slideWidth, behavior: 'smooth' });
      });
      this.indicatorContainer.appendChild(dot);
    }
  }

  updateIndicator() {
    if (!this.indicatorContainer) return;
    const dots = this.indicatorContainer.querySelectorAll('.cart-drawer-reviews__scroll-dot');
    if (dots.length === 0 || this.cards.length === 0) return;

    const { scrollLeft } = this.track;
    const slideWidth = this.getSlideWidth();
    const activeIndex = Math.round(scrollLeft / slideWidth);

    dots.forEach((dot, index) => {
      dot.classList.toggle('cart-drawer-reviews__scroll-dot--active', index === activeIndex);
    });
  }
}

if (!customElements.get('cart-drawer-reviews')) {
  customElements.define('cart-drawer-reviews', CartDrawerReviews);
}
