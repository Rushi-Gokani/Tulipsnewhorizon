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
        pagination: {
          el: this.querySelector('.swiper-pagination'),
          clickable: true,
          renderBullet: (i, className) => {
            const totalSlides = this.querySelectorAll('.swiper-slide').length;
            return `
            <button class="${className}">
              <span>0${i + 1}</span>
              <svg class="square-progress" width="26" height="26">
                <rect class="square-origin" width="26" height="26" rx="5" ry="5" />
              </svg>
              <svg class="progress" width="18" height="18" style="inset-inline-start: ${0 - ((i * 2.4) + 3.4)}rem">
                <circle class="circle-origin" r="8" cx="9.5" cy="9.5"></circle>
              </svg>
            </button>
            `;
          }
        },
        autoplay: this.dataset.autoplay === 'true' ? autoplayOptions : false
      });
    }
  }
  customElements.define('image-slider', ImageSlider);
}
