/**
 * Simple Product Card - Interactive functionality
 * Handles Add to Cart, Notify Me, and Wishlist
 * Standalone component that doesn't conflict with existing product-card.js
 */

class SimpleProductCard {
  constructor() {
    this.init();
  }

  init() {
    this.bindAddToCartEvents();
    this.bindNotifyMeEvents();
    this.bindWishlistEvents();
    this.initWishlistFromStorage();
  }

  /**
   * Handle Add to Cart button clicks
   */
  bindAddToCartEvents() {
    const addToCartButtons = document.querySelectorAll('.simple-product-card__add-to-cart');

    addToCartButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const variantId = button.dataset.variantId;

        if (!variantId) {
          this.showNotification('Please select a product variant', 'error');
          return;
        }

        this.addToCart(variantId, button);
      });
    });
  }

  /**
   * Add item to cart via Shopify AJAX API
   */
  async addToCart(variantId, button) {
    // Show loading state
    button.classList.add('loading');

    try {
      const response = await fetch(window.Shopify.routes.root + 'cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            id: parseInt(variantId),
            quantity: 1
          }]
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Show success state
        button.classList.remove('loading');
        button.classList.add('success');

        // Reset button after delay
        setTimeout(() => {
          button.classList.remove('success');
        }, 2500);

        // Show notification
        this.showNotification('Added to cart!', 'success');

        // Trigger cart update event
        this.triggerCartUpdate();
      } else {
        throw new Error(data.description || 'Error adding to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      button.classList.remove('loading');
      this.showNotification(error.message || 'Unable to add product', 'error');
    }
  }

  /**
   * Handle Notify Me button clicks
   */
  bindNotifyMeEvents() {
    const notifyMeButtons = document.querySelectorAll('.simple-product-card__notify-me');

    notifyMeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const card = button.closest('.simple-product-card');
        const productId = button.dataset.productId;
        const productTitle = card?.querySelector('.simple-product-card__title')?.textContent || 'this product';

        this.openNotifyMeModal(productId, productTitle);
      });
    });
  }

  /**
   * Open Notify Me modal dialog
   */
  openNotifyMeModal(productId, productTitle) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.simple-notify-modal');
    if (existingModal) existingModal.remove();

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'simple-notify-modal';
    modal.innerHTML = `
      <div class="simple-notify-modal__overlay"></div>
      <div class="simple-notify-modal__dialog">
        <button class="simple-notify-modal__close" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 4L16 16M4 16L16 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <div class="simple-notify-modal__header">
          <svg class="simple-notify-modal__icon" width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" fill="#e8f5e9"/>
            <path d="M24 14V26M24 34V32" stroke="#2d7a3e" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
          <h2 class="simple-notify-modal__title">Notify Me When Available</h2>
          <p class="simple-notify-modal__subtitle">We'll email you when <strong>"${productTitle}"</strong> is back in stock.</p>
        </div>
        <form class="simple-notify-modal__form">
          <div class="simple-notify-modal__field">
            <label for="notify-email-${productId}">Email Address</label>
            <input
              type="email"
              id="notify-email-${productId}"
              name="email"
              placeholder="Enter your email"
              required
            >
          </div>
          <button type="submit" class="simple-notify-modal__submit">
            <span>Notify Me</span>
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Animate in
    setTimeout(() => modal.classList.add('active'), 10);

    // Bind events
    this.bindModalEvents(modal, productId);
  }

  /**
   * Bind modal interaction events
   */
  bindModalEvents(modal, productId) {
    const overlay = modal.querySelector('.simple-notify-modal__overlay');
    const closeBtn = modal.querySelector('.simple-notify-modal__close');
    const form = modal.querySelector('.simple-notify-modal__form');
    const input = form.querySelector('input[type="email"]');

    // Focus input
    setTimeout(() => input.focus(), 100);

    // Close handlers
    const closeModal = () => {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.remove();
        document.body.style.overflow = '';
      }, 300);
    };

    overlay.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);

    // Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);

    // Form submit
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = input.value;
      const submitBtn = form.querySelector('.simple-notify-modal__submit');

      submitBtn.classList.add('loading');
      submitBtn.innerHTML = '<span>Submitting...</span>';

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      submitBtn.classList.remove('loading');
      submitBtn.classList.add('success');
      submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 10L7.5 13.5L16 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>You're on the list!</span>
      `;

      setTimeout(() => {
        closeModal();
        this.showNotification('We\'ll notify you when this product is back!', 'success');
      }, 1500);
    });
  }

  /**
   * Handle Wishlist button events
   */
  bindWishlistEvents() {
    const wishlistButtons = document.querySelectorAll('.simple-product-card__wishlist');

    wishlistButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const productId = button.dataset.productId;
        this.toggleWishlist(productId, button);
      });
    });
  }

  /**
   * Toggle product in wishlist
   */
  toggleWishlist(productId, button) {
    let wishlist = JSON.parse(localStorage.getItem('simple-wishlist') || '[]');

    if (wishlist.includes(productId)) {
      // Remove from wishlist
      wishlist = wishlist.filter(id => id !== productId);
      button.classList.remove('active');
      this.showNotification('Removed from wishlist', 'info');
    } else {
      // Add to wishlist
      wishlist.push(productId);
      button.classList.add('active');

      // Add heart animation
      button.style.animation = 'heartBurst 0.6s ease';
      setTimeout(() => button.style.animation = '', 600);

      this.showNotification('Added to wishlist', 'success');
    }

    localStorage.setItem('simple-wishlist', JSON.stringify(wishlist));
  }

  /**
   * Initialize wishlist states from localStorage
   */
  initWishlistFromStorage() {
    const wishlist = JSON.parse(localStorage.getItem('simple-wishlist') || '[]');

    wishlist.forEach(productId => {
      const button = document.querySelector(`.simple-product-card__wishlist[data-product-id="${productId}"]`);
      if (button) {
        button.classList.add('active');
      }
    });
  }

  /**
   * Trigger cart update event
   */
  triggerCartUpdate() {
    // Update cart count
    fetch(window.Shopify.routes.root + 'cart.js')
      .then(response => response.json())
      .then(cart => {
        // Update all cart count elements
        const cartCountElements = document.querySelectorAll('.cart-count, [data-cart-count]');
        cartCountElements.forEach(el => {
          el.textContent = cart.item_count;
          el.classList.add('updated');
          setTimeout(() => el.classList.remove('updated'), 300);
        });

        // Dispatch custom event for other scripts
        document.dispatchEvent(new CustomEvent('cart:updated', {
          detail: { cart }
        }));

        // Try to open cart drawer if exists
        const cartDrawer = document.querySelector('[data-cart-drawer], .cart-drawer, #cart-drawer');
        if (cartDrawer) {
          cartDrawer.classList.add('open');
        }
      })
      .catch(err => console.log('Could not update cart count:', err));
  }

  /**
   * Show notification toast
   */
  showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existing = document.querySelector('.simple-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `simple-notification simple-notification--${type}`;

    const icon = type === 'success'
      ? '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10L7.5 13.5L16 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      : type === 'error'
      ? '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="2"/><path d="M10 7V11M10 13V14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="2"/><path d="M10 7V13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

    notification.innerHTML = `${icon}<span>${message}</span>`;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);

    // Auto remove
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Modal Styles
const modalStyles = `
  <style>
    .simple-notify-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .simple-notify-modal.active {
      opacity: 1;
    }

    .simple-notify-modal__overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
    }

    .simple-notify-modal__dialog {
      position: relative;
      background: #ffffff;
      border-radius: 16px;
      padding: 32px;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      transform: scale(0.9) translateY(20px);
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .simple-notify-modal.active .simple-notify-modal__dialog {
      transform: scale(1) translateY(0);
    }

    .simple-notify-modal__close {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 32px;
      height: 32px;
      background: #f5f5f5;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      color: #666;
    }

    .simple-notify-modal__close:hover {
      background: #e0e0e0;
      color: #333;
    }

    .simple-notify-modal__header {
      text-align: center;
      margin-bottom: 24px;
    }

    .simple-notify-modal__icon {
      margin: 0 auto 16px;
    }

    .simple-notify-modal__title {
      font-size: 22px;
      font-weight: 700;
      margin: 0 0 8px;
      color: #1a1a1a;
    }

    .simple-notify-modal__subtitle {
      font-size: 14px;
      color: #666666;
      margin: 0;
      line-height: 1.5;
    }

    .simple-notify-modal__form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .simple-notify-modal__field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .simple-notify-modal__field label {
      font-size: 13px;
      font-weight: 600;
      color: #333;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .simple-notify-modal__field input {
      padding: 12px 16px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-size: 15px;
      transition: all 0.2s ease;
    }

    .simple-notify-modal__field input:focus {
      outline: none;
      border-color: #2d7a3e;
      box-shadow: 0 0 0 3px rgba(45, 122, 62, 0.1);
    }

    .simple-notify-modal__submit {
      padding: 14px 24px;
      background: linear-gradient(135deg, #2d7a3e 0%, #246332 100%);
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .simple-notify-modal__submit:hover {
      background: linear-gradient(135deg, #246332 0%, #1e5229 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(45, 122, 62, 0.3);
    }

    .simple-notify-modal__submit.loading {
      opacity: 0.7;
      pointer-events: none;
    }

    .simple-notify-modal__submit.success {
      background: #27ae60 !important;
    }

    .simple-notification {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #333;
      color: #ffffff;
      padding: 14px 20px;
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      transform: translateX(120%);
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .simple-notification.show {
      transform: translateX(0);
    }

    .simple-notification--success {
      background: linear-gradient(135deg, #27ae60, #219a52);
    }

    .simple-notification--error {
      background: linear-gradient(135deg, #e74c3c, #c0392b);
    }

    .simple-notification--info {
      background: linear-gradient(135deg, #3498db, #2980b9);
    }

    @keyframes heartBurst {
      0% { transform: scale(1); }
      25% { transform: scale(1.3); }
      50% { transform: scale(0.9); }
      75% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }

    @media (max-width: 480px) {
      .simple-notify-modal__dialog {
        padding: 24px;
        margin: 16px;
      }

      .simple-notification {
        right: 16px;
        left: 16px;
        bottom: 16px;
      }
    }
  </style>
`;

// Inject modal styles
if (!document.getElementById('simple-product-card-styles')) {
  const styleContainer = document.createElement('div');
  styleContainer.id = 'simple-product-card-styles';
  styleContainer.innerHTML = modalStyles;
  document.head.appendChild(styleContainer);
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new SimpleProductCard());
} else {
  new SimpleProductCard();
}

// Re-initialize when sections load (Shopify theme editor)
document.addEventListener('shopify:section:load', () => new SimpleProductCard());
