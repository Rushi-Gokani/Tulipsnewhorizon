import { Component } from '@theme/component';
import { ThemeEvents } from '@theme/events';
import { debounce } from '@theme/utilities';
import { formatMoney } from '@theme/money-formatting';

const AMOUNT_TOKEN = '{{ amount }}';

export class FreeShippingBarComponent extends Component {
  requiredRefs = ['fill', 'message', 'track', 'progressTemplate', 'successTemplate'];

  /** @type {AbortController} */
  #abortController = new AbortController();
  /** @type {AbortController | null} */
  #fetchAbortController = null;
  /** @type {number} */
  #thresholdCents = 0;
  /** @type {string} */
  #moneyFormat = '{{amount}}';
  /** @type {string} */
  #currency = 'USD';
  /** @type {ResizeObserver} */
  #resizeObserver = new ResizeObserver(() => this.#updateReservedSpace());

  connectedCallback() {
    super.connectedCallback();

    this.#thresholdCents = Number(this.dataset.thresholdCents) || 0;
    this.#moneyFormat = this.dataset.moneyFormat || this.#moneyFormat;
    this.#currency = this.dataset.currency || this.#currency;

    document.addEventListener(ThemeEvents.cartUpdate, this.#handleCartUpdate, {
      signal: this.#abortController.signal,
    });

    this.#resizeObserver.observe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.#abortController.abort();
    this.#fetchAbortController?.abort();
    this.#debouncedFetchCart.cancel();
    this.#resizeObserver.disconnect();
    document.body.style.removeProperty('--free-shipping-bar-height');
  }

  #updateReservedSpace() {
    document.body.style.setProperty('--free-shipping-bar-height', `${this.offsetHeight}px`);
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
    this.toggleAttribute('cart-empty', itemCount === 0);

    const thresholdCents = this.#thresholdCents;
    const achieved = thresholdCents <= 0 || subtotalCents >= thresholdCents;
    const progressPercent = achieved ? 100 : Math.min((subtotalCents / thresholdCents) * 100, 100);

    this.refs.fill.style.width = `${progressPercent}%`;
    this.refs.track.setAttribute('aria-valuenow', `${Math.round(progressPercent)}`);
    this.toggleAttribute('achieved', achieved);

    const template = achieved ? this.refs.successTemplate : this.refs.progressTemplate;
    const remainingCents = Math.max(thresholdCents - subtotalCents, 0);
    const formattedAmount = formatMoney(remainingCents, this.#moneyFormat, this.#currency);

    this.refs.message.innerHTML = template.innerHTML.split(AMOUNT_TOKEN).join(formattedAmount);
  }
}

if (!customElements.get('free-shipping-bar-component')) {
  customElements.define('free-shipping-bar-component', FreeShippingBarComponent);
}
