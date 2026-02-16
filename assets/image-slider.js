if(!customElements.get('image-slider')) {
  class ImageSlider extends HTMLElement {
    constructor() {
      super();

      if (Shopify.designMode) {
        window.addEventListener('shopify:section:load', e => {
          this.mountSlider();
        });
      }

      this.initSliderWhenReady();
    }

    initSliderWhenReady() {
      if (typeof Swiper !== 'undefined') {
        this.mountSlider();
      } else {
        window.addEventListener('load', () => {
          this.mountSlider();
        });
      }
    }

    mountSlider() {
      if (typeof Swiper === 'undefined') return;
      
      const autoplayOptions = {
        delay: this.dataset.autoplayInterval,
        disableOnInteraction: false
      };

      this.slider = new Swiper(this, {
        effect: 'slide',
        rewind: true,
        slidesPerView: 1,
        speed: 600,
        loop: true,
        navigation: {
          nextEl: this.querySelector('.swiper-button--next'),
          prevEl: this.querySelector('.swiper-button--prev')
        },
        autoplay: this.dataset.autoplay === 'true' ? autoplayOptions : false
      });
    }
  }
  customElements.define('image-slider', ImageSlider);
}
