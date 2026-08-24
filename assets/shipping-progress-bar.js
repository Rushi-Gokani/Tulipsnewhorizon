import { Component } from '@theme/component';
import { ThemeEvents, CartAddEvent, CartErrorEvent } from '@theme/events';
import { debounce, fetchConfig } from '@theme/utilities';
import { formatMoney } from '@theme/money-formatting';

const AMOUNT_TOKEN = '{{ amount }}';
const CONFETTI_COLORS = ['#F2871F', '#388E3C', '#1A73E8', '#E91E63', '#FBC02D'];
const DISMISSED_STORAGE_KEY = 'shipping-progress-bar-dismissed';

export class ShippingProgressBarComponent extends Component {
  requiredRefs = ['fill', 'track', 'basketTotal', 'remainingText', 'unlockedPill', 'unlockedSub', 'toast'];

  /** @type {AbortController} */
  #abortController = new AbortController();
  /** @type {AbortController | null} */
  #fetchAbortController = null;
  /** @type {AbortController | null} */
  #upsellAbortController = null;
  /** @type {number} */
  #thresholdCents = 0;
  /** @type {string} */
  #moneyFormat = '{{amount}}';
  /** @type {string} */
  #currency = 'USD';
  /** @type {string} */
  #remainingTemplate = '{{ amount }} to go';
  /** @type {boolean} */
  #wasAchieved = false;
  /** @type {boolean} */
  #dismissed = false;
  /** @type {number | undefined} */
  #toastTimeout;

  connectedCallback() {
    super.connectedCallback();

    this.#thresholdCents = Number(this.dataset.thresholdCents) || 0;
    this.#moneyFormat = this.dataset.moneyFormat || this.#moneyFormat;
    this.#currency = this.dataset.currency || this.#currency;
    this.#remainingTemplate = this.dataset.remainingTemplate || this.#remainingTemplate;
    this.#wasAchieved = this.hasAttribute('achieved');

    try {
      this.#dismissed = sessionStorage.getItem(DISMISSED_STORAGE_KEY) === '1';
    } catch {
      this.#dismissed = false;
    }

    if (this.#dismissed) this.hidden = true;

    document.addEventListener(ThemeEvents.cartUpdate, this.#handleCartUpdate, {
      signal: this.#abortController.signal,
    });

    // The server-rendered hidden/achieved state can go stale if this markup is restored
    // from browser back/forward cache after cart activity elsewhere. Reconcile with the
    // real cart on every connect rather than trusting the snapshot at render time.
    this.#fetchCartAndRender();
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.#abortController.abort();
    this.#fetchAbortController?.abort();
    this.#upsellAbortController?.abort();
    this.#debouncedFetchCart.cancel();
    clearTimeout(this.#toastTimeout);
  }

  /** @param {CustomEvent} event */
  #handleCartUpdate = (event) => {
    const resource = event.detail?.resource;
    const itemCount = resource?.item_count ?? event.detail?.data?.itemCount;

    if (resource && typeof resource.items_subtotal_price === 'number' && typeof itemCount === 'number') {
      this.#render(resource.items_subtotal_price, itemCount);
      return;
    }

    this.#debouncedFetchCart();
  };

  #debouncedFetchCart = debounce(() => this.#fetchCartAndRender(), 200);

  async #fetchCartAndRender() {
    this.#fetchAbortController?.abort();
    this.#fetchAbortController = new AbortController();

    try {
      const response = await fetch(Theme.routes.cart_url + '.js', {
        signal: this.#fetchAbortController.signal,
      });

      if (!response.ok) return;

      const cart = await response.json();
      this.#render(cart.items_subtotal_price, cart.item_count);
    } catch (error) {
      if (error.name !== 'AbortError') throw error;
    }
  }

  /**
   * @param {number} subtotalCents
   * @param {number} itemCount
   */
  #render(subtotalCents, itemCount) {
    this.hidden = this.#dismissed || itemCount === 0;

    const thresholdCents = this.#thresholdCents;
    const achieved = thresholdCents <= 0 || subtotalCents >= thresholdCents;
    const progressPercent = achieved ? 100 : Math.min((subtotalCents / thresholdCents) * 100, 100);

    this.refs.fill.style.width = `${progressPercent}%`;
    this.refs.track.setAttribute('aria-valuenow', `${Math.round(progressPercent)}`);
    this.toggleAttribute('achieved', achieved);

    this.refs.basketTotal.textContent = formatMoney(subtotalCents, this.#moneyFormat, this.#currency);

    const remainingCents = Math.max(thresholdCents - subtotalCents, 0);
    const formattedRemaining = formatMoney(remainingCents, this.#moneyFormat, this.#currency);
    this.refs.remainingText.textContent = this.#remainingTemplate.split(AMOUNT_TOKEN).join(formattedRemaining);

    this.refs.remainingText.hidden = achieved;
    this.refs.unlockedPill.hidden = !achieved;
    this.refs.unlockedSub.hidden = !achieved;

    if (this.refs.upsellButton) {
      this.refs.upsellButton.hidden = achieved;
    }

    if (achieved && !this.#wasAchieved) {
      this.#celebrateUnlock();
    }

    this.#wasAchieved = achieved;
  }

  #celebrateUnlock() {
    if (this.dataset.showToast !== 'false') {
      this.#showToast('Free delivery unlocked');
    }

    if (this.dataset.showConfetti !== 'false') {
      this.#burstConfetti();
    }
  }

  /** @param {string} message */
  #showToast(message) {
    clearTimeout(this.#toastTimeout);

    const toast = this.refs.toast;
    toast.textContent = message;
    toast.hidden = false;

    requestAnimationFrame(() => toast.toggleAttribute('visible', true));

    this.#toastTimeout = setTimeout(() => {
      toast.removeAttribute('visible');
      setTimeout(() => {
        toast.hidden = true;
      }, 250);
    }, 2200);
  }

  #burstConfetti() {
    const container = document.createElement('div');
    container.className = 'shipping-progress-bar-confetti';

    for (let i = 0; i < 40; i++) {
      const piece = document.createElement('span');
      piece.className = 'shipping-progress-bar-confetti__piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.backgroundColor = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      piece.style.setProperty('--confetti-drift', `${(Math.random() - 0.5) * 200}px`);
      piece.style.setProperty('--confetti-rotate', `${360 + Math.random() * 360}deg`);
      piece.style.animationDuration = `${1.2 + Math.random() * 0.8}s`;
      piece.style.animationDelay = `${Math.random() * 0.2}s`;
      container.appendChild(piece);
    }

    document.body.appendChild(container);
    setTimeout(() => container.remove(), 2500);
  }

  handleDismissClick = () => {
    this.#dismissed = true;
    this.hidden = true;

    try {
      sessionStorage.setItem(DISMISSED_STORAGE_KEY, '1');
    } catch {
      // sessionStorage unavailable (e.g. privacy mode) — dismissal just won't persist across page loads.
    }
  };

  /** @param {Event} event */
  handleUpsellClick = async (event) => {
    const button = /** @type {HTMLButtonElement} */ (event.currentTarget);
    const variantId = this.dataset.upsellVariantId;

    if (!variantId || button.disabled) return;

    button.disabled = true;
    const label = this.refs.upsellButtonText;
    const originalText = label?.textContent ?? '';
    if (label) label.textContent = 'Adding…';

    this.#upsellAbortController?.abort();
    this.#upsellAbortController = new AbortController();

    try {
      const response = await fetch(Theme.routes.cart_add_url, {
        ...fetchConfig('json', {
          body: JSON.stringify({ items: [{ id: Number(variantId), quantity: 1 }] }),
        }),
        signal: this.#upsellAbortController.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        document.dispatchEvent(new CartErrorEvent(this.dataset.sectionId ?? '', data.message, data.description, data.errors));
        return;
      }

      if (this.dataset.showToast !== 'false') {
        this.#showToast(`${data.title || 'Item'} added`);
      }

      document.dispatchEvent(
        new CartAddEvent({}, this.dataset.sectionId ?? '', {
          source: 'shipping-progress-bar-component',
          itemCount: data.quantity,
          variantId: String(variantId),
        })
      );
    } catch (error) {
      if (error.name !== 'AbortError') throw error;
    } finally {
      button.disabled = false;
      if (label) label.textContent = originalText;
    }
  };
}

if (!customElements.get('shipping-progress-bar-component')) {
  customElements.define('shipping-progress-bar-component', ShippingProgressBarComponent);
}
