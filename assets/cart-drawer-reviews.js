class CartDrawerReviews extends HTMLElement {
  connectedCallback() {
    this.track = this.querySelector('[data-reviews-track]');
    this.prevBtn = this.querySelector('[data-reviews-prev]');
    this.nextBtn = this.querySelector('[data-reviews-next]');
    this.indicatorContainer = this.querySelector('[data-reviews-indicator]');

    if (!this.track || !this.prevBtn || !this.nextBtn) return;

    this.cards = this.querySelectorAll('[data-review-card]');
    this.cardCount = this.cards.length;

    this.prevBtn.addEventListener('click', () => this.scroll(-1));
    this.nextBtn.addEventListener('click', () => this.scroll(1));

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

  scroll(direction) {
    const cardWidth = this.cards[0]?.offsetWidth || 240;
    const gap = 12;
    const scrollAmount = (cardWidth + gap) * direction;
    this.track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
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
        const cardWidth = this.cards[i]?.offsetWidth || 240;
        const gap = 12;
        this.track.scrollTo({ left: i * (cardWidth + gap), behavior: 'smooth' });
      });
      this.indicatorContainer.appendChild(dot);
    }
  }

  updateIndicator() {
    if (!this.indicatorContainer) return;
    const dots = this.indicatorContainer.querySelectorAll('.cart-drawer-reviews__scroll-dot');
    if (dots.length === 0 || this.cards.length === 0) return;

    const { scrollLeft } = this.track;
    const cardWidth = this.cards[0]?.offsetWidth || 240;
    const gap = 12;
    const activeIndex = Math.round(scrollLeft / (cardWidth + gap));

    dots.forEach((dot, index) => {
      dot.classList.toggle('cart-drawer-reviews__scroll-dot--active', index === activeIndex);
    });
  }
}

if (!customElements.get('cart-drawer-reviews')) {
  customElements.define('cart-drawer-reviews', CartDrawerReviews);
}
