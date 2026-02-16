{%- if section.blocks.size > 0 -%}
  {{- 'component-card-slider.css' | asset_url | stylesheet_tag -}}
  {{- 'section-testimonials.css' | asset_url | stylesheet_tag -}}

  <script src="{{- 'card-slider.js' | asset_url -}}" defer="defer"></script>

  {%- style -%}
    #shopify-section-{{ section.id }} > div {
      padding-block-start: calc(var(--section-spacing-unit-size) * {{ section.settings.spacing_top }});
      padding-block-end: calc(var(--section-spacing-unit-size) * {{ section.settings.spacing_bottom }});
      --media-aspect-ratio: {{ section.settings.image_aspect_ratio }};
      --block-padding: calc(var(--spacing-unit-size) * {{ section.settings.spacing_inner }});
    }
  {%- endstyle -%}

  {%- assign rating_icon = section.settings.rating_icon -%}
  {%- if section.settings.heading != blank or section.settings.subheading != blank or rating_icon != 'none' -%}
    {%- capture section_title -%}
      <div class="text-center" id="reviews">
      <div class="impact-line">
        <span class="star">⭐</span>
        <span>300,000+ online ratings and reviews</span>
        <span class="star">⭐</span>
        
      </div>
     {% comment %}   {%- if rating_icon != 'none' -%}
          <div class="section-testimonials__ratings">
            {% for i in (1..5) %}
              {%- if rating_icon == 'star' -%}
                {% render 'icon', icon_name: 'theme-star-filled', class: 'icon' %}
              {%- else -%}
                <span class="testimonial__rating-circle circle-filled"></span>
              {%- endif -%}
            {% endfor %}
          </div>
        {%- endif -%} {% endcomment %} 
        {%- if section.settings.subheading != blank -%}
          <span class="section-testimonials__subheading">{{- section.settings.subheading -}}</span>
        {%- endif -%}
        {%- if section.settings.heading != blank -%}
          <h2 class="section__heading {{ section.settings.heading_size }}">
            {{- section.settings.heading -}}
          </h2>
        {%- endif -%}
      </div>
    {%- endcapture -%}
  {%- endif -%}

  <div class="color-{{ section.settings.color_scheme }} gradient">
    <div class="container {{ section.settings.section_width }} js-animation-fade-in section-testimonials--{{ section.settings.layout }} position--{{ section.settings.image_position }} overflow-hidden">
      {%- liquid
        if section.settings.media_show_on == 'mobile'
          assign media_classes = 'large-up-hide'
        elsif section.settings.media_show_on == 'desktop'
          assign media_classes = 'small-down-hide'
        endif
      -%}
      <div class="testimonials__media media {{ media_classes }}">
        {%- liquid
          if section.settings.image != blank
            render 'image', image: section.settings.image
          else
            echo 'image' | placeholder_svg_tag: 'placeholder-svg'
          endif
        -%}
      </div>
      <div class="testimonials__content">
        <div class="testimonials__content-in">
          {{ section_title }}

          {%- liquid
            assign slideshow_spacing_desktop = settings.spacing_desktop | times: 10 | round: 0
            assign slideshow_spacing_mobile = settings.spacing_mobile | times: 10 | round: 0

            assign slideshow_autoplay = section.settings.slider_autoplay

            if section.settings.layout == 'horizontal-w-media'
              assign slideshow_loop = true
              assign slideshow_pagination = '"progressbar"'
              assign slideshow_navigation = '{ "prevEl": ".swiper-button--prev-' | append: section.id | append: '", "nextEl": ".swiper-button--next-' | append: section.id | append: '" }'
              assign slideshow_section_layout = '"testimonials__horizontal-w-media"'
            elsif section.settings.layout == 'vertical-w-media'
              assign slideshow_loop = false
              assign slideshow_pagination = '"render_bullet"'
              assign slideshow_navigation = '{ "nextEl": ".swiper-button--next-' | append: section.id | append: '" }'
              assign slideshow_section_layout = '"testimonials__vertical-w-media"'
            elsif section.settings.layout == 'carousel-none-media'
              assign slideshow_loop = true
              assign slideshow_pagination = '"progressbar"'
              assign slideshow_navigation = 'true'
              assign slideshow_section_layout = '"testimonials__carousel-none-media"'
              assign slideshow_navigation = '{ "prevEl": ".swiper-button--prev-' | append: section.id | append: '", "nextEl": ".swiper-button--next-' | append: section.id | append: '" }'
            endif

            if section.blocks.size == 1
              assign slideshow_loop = false
            endif
          -%}
          <card-slider
            class="swiper card-slider card-slider--testimonials js-testimonials {{ section.settings.layout }}"
            data-swiper-options='
              {
                "slidesPerView": 1.15,
                "rewind": true,
                "followFinger": false,
                "spaceBetweenMobile": {{ slideshow_spacing_mobile }},
                "spaceBetweenDesktop": {{ slideshow_spacing_desktop }},
                {%- if slideshow_autoplay > 0 -%}
                "autoplay": {
                  "delay": {{ slideshow_autoplay | times: 1000 }}
                  },
                {%- endif -%}
                "loop": {{ slideshow_loop }},
                "pagination": {{ slideshow_pagination }},
                "navigation": {{ slideshow_navigation }},
                "sectionLayout": {{ slideshow_section_layout }},
                "slideCount": {{ section.blocks.size }},
                "sectionId": "{{ section.id }}"
              }
            '
          >
            <div class="swiper-wrapper card-slider__wrapper">
              {%- for block in section.blocks -%}
                <div class="{% if section.blocks.size > 1 %}swiper-slide {% endif %}card-slider__slide testimonials__block">
                  <div class="testimonial__box">
                    <div class="testimonial__body color-{{ block.settings.color_scheme }}">
                      <div class="testimonial__content">
                        {%- if block.settings.author != blank -%}
                          <cite class="testimonial__author">
                            {{- block.settings.author -}}
                          </cite>
                        {%- endif -%}
                        {%- assign rating_score = block.settings.rating_score -%}
                        {%- if rating_score > 0 -%}
                          <div class="testimonial__rating">
                            {% for i in (1..5) %}
                              {% if i <= rating_score %}
                                <div class="testimonial__rating-filled">
                                  {%- if rating_icon == 'star' -%}
                                    {% render 'icon', icon_name: 'theme-star-filled', class: 'icon' %}
                                  {%- else -%}
                                    <span class="testimonial__rating-circle circle-filled"></span>
                                  {%- endif -%}
                                </div>
                              {% else %}
                                <div class="testimonial__rating-outlined">
                                  {%- if rating_icon == 'star' -%}
                                    {% render 'icon', icon_name: 'theme-star', class: 'icon' %}
                                  {%- else -%}
                                    <span class="testimonial__rating-circle"></span>
                                  {%- endif -%}
                                </div>
                              {% endif %}
                            {% endfor %}
                          </div>
                        {%- endif -%}
                        {%- if block.settings.quote != blank -%}
                          <blockquote class="testimonial__quote">
                            {{- block.settings.quote -}}
                          </blockquote>
                        {%- endif -%}
                      </div>
                    </div>
                  </div>
                </div>
              {%- endfor -%}
            </div>
            <div class="section-testimonials__footer">
              {%- if section.settings.layout == 'vertical-w-media' and section.blocks.size > 3 -%}
                <div class="swiper-pagination"></div>
                <button
                  class="swiper-button text-current swiper-button--next-{{ section.id }} section-testimonials__footer--arrow-button"
                  aria-label="{{- 'theme.actions.next' | t -}}"
                >
                  {%- render 'icon', icon_name: 'theme-arrow', class: 'icon' -%}
                </button>
              {%- endif -%}

              <div class="swiper-buttons card-slider__buttons no-js-hidden">
                <div class="card-slider__buttons-inner">
                  <button
                    class="swiper-button text-current swiper-button--prev-{{ section.id }}"
                    aria-label="{{- 'theme.actions.previous' | t -}}"
                  >
                    {%- render 'icon', icon_name: 'theme-chevron', class: 'icon' -%}
                  </button>
                  <button
                    class="swiper-button text-current swiper-button--next-{{ section.id }}"
                    aria-label="{{- 'theme.actions.next' | t -}}"
                  >
                    {%- render 'icon', icon_name: 'theme-chevron', class: 'icon' -%}
                  </button>
                </div>
              </div>
              <div class="autoplay-progress autoplay-progress--{{ section.id }} autoplay-progress--line">
                <svg viewBox="0 0 100 2" width="10rem" height="1rem">
                  <line x1="0" y1="2" x2="100" y2="2"></line>
                </svg>
                <span></span>
              </div>
            </div>
          </card-slider>
        </div>
      </div>
    </div>
  </div>
{%- endif -%}

{% schema %}
{
  "name": "t:sections.testimonials.name",
  "tag": "section",
  "class": "section-testimonials",
  "settings": [
    {
      "type": "inline_richtext",
      "id": "heading",
      "label": "t:sections.global.element.heading.label",
      "default": "Testimonials"
    },
    {
      "type": "select",
      "id": "heading_size",
      "label": "t:sections.global.element.heading_size.label",
      "options": [
        {
          "value": "h6",
          "label": "XS"
        },
        {
          "value": "h5",
          "label": "S"
        },
        {
          "value": "h4",
          "label": "M"
        },
        {
          "value": "h3",
          "label": "L"
        },
        {
          "value": "h2",
          "label": "XL"
        }
      ],
      "default": "h3"
    },
    {
      "type": "inline_richtext",
      "id": "subheading",
      "label": "t:sections.global.element.subheading.label"
    },
    {
      "type": "select",
      "id": "rating_icon",
      "label": "t:sections.testimonials.settings.rating_icon.label",
      "options": [
        {
          "value": "none",
          "label": "t:sections.testimonials.settings.rating_icon.options.options__0.label"
        },
        {
          "value": "star",
          "label": "t:sections.testimonials.settings.rating_icon.options.options__1.label"
        },
        {
          "value": "circle",
          "label": "t:sections.testimonials.settings.rating_icon.options.options__2.label"
        }
      ],
      "default": "star"
    },
    {
      "type": "header",
      "content": "t:sections.global.header.general.content"
    },
    {
      "type": "select",
      "id": "layout",
      "label": "t:sections.testimonials.settings.layout.label",
      "info": "t:sections.testimonials.settings.layout.info",
      "options": [
        {
          "value": "horizontal-w-media",
          "label": "t:sections.testimonials.settings.layout.options.single.label"
        },
        {
          "value": "vertical-w-media",
          "label": "t:sections.testimonials.settings.layout.options.multi.label"
        },
        {
          "value": "carousel-none-media",
          "label": "t:sections.testimonials.settings.layout.options.carousel.label"
        }
      ],
      "default": "horizontal-w-media"
    },
    {
      "type": "range",
      "id": "slider_autoplay",
      "label": "t:sections.global.slideshow.autoplay_interval.label",
      "info": "t:sections.global.slideshow.autoplay_interval.info",
      "min": 0,
      "max": 10,
      "step": 0.5,
      "unit": "sec",
      "default": 3
    },
    {
      "type": "header",
      "content": "t:sections.global.header.media.content"
    },
    {
      "type": "image_picker",
      "id": "image",
      "label": "t:sections.global.element.image.label"
    },
    {
      "type": "select",
      "id": "image_position",
      "label": "t:sections.global.element.image.position.label",
      "options": [
        {
          "value": "image-start",
          "label": "t:sections.global.element.image.position.options.start.label"
        },
        {
          "value": "image-end",
          "label": "t:sections.global.element.image.position.options.end.label"
        }
      ],
      "default": "image-start"
    },
    {
      "type": "select",
      "id": "image_aspect_ratio",
      "label": "t:sections.global.aspect_ratio.for__image.label",
      "options": [
        {
          "value": "auto",
          "label": "t:sections.global.aspect_ratio.options.auto.label"
        },
        {
          "value": "1/1",
          "label": "1:1"
        },
        {
          "value": "4/3",
          "label": "4:3"
        },
        {
          "value": "3/4",
          "label": "3:4"
        },
        {
          "value": "9/16",
          "label": "9:16"
        }
      ],
      "default": "1/1"
    },
    {
      "type": "select",
      "id": "media_show_on",
      "label": "t:sections.global.settings.show_on.label",
      "options": [
        {
          "value": "desktop",
          "label": "t:sections.global.settings.show_on.options.desktop.label"
        },
        {
          "value": "mobile",
          "label": "t:sections.global.settings.show_on.options.mobile.label"
        },
        {
          "value": "both",
          "label": "t:sections.global.settings.show_on.options.both.label"
        }
      ],
      "default": "desktop"
    },
    {
      "type": "header",
      "content": "t:sections.global.header.settings.for__blocks.content",
      "info": "t:sections.global.header.settings.for__blocks.info"
    },
    {
      "type": "select",
      "id": "spacing_inner",
      "label": "t:sections.global.spacing.inner.label",
      "options": [
        {
          "value": "0",
          "label": "t:sections.global.spacing.options.none.label"
        },
        {
          "value": "1",
          "label": "S"
        },
        {
          "value": "2",
          "label": "M"
        },
        {
          "value": "4",
          "label": "L"
        },
        {
          "value": "6",
          "label": "XL"
        }
      ],
      "default": "2"
    },
    {
      "type": "header",
      "content": "t:sections.global.header.settings.content",
      "info": "t:sections.global.header.settings.info"
    },
    {
      "type": "select",
      "id": "section_width",
      "options": [
        {
          "value": "max-w-page",
          "label": "t:sections.global.settings.section_width.options__1.label"
        },
        {
          "value": "max-w-fluid",
          "label": "t:sections.global.settings.section_width.options__2.label"
        },
        {
          "value": "max-w-full",
          "label": "t:sections.global.settings.section_width.options__3.label"
        }
      ],
      "default": "max-w-page",
      "label": "t:sections.global.settings.section_width.label"
    },
    {
      "type": "color_scheme",
      "id": "color_scheme",
      "default": "scheme-1",
      "label": "t:sections.global.color_scheme.label"
    },
    {
      "type": "select",
      "id": "spacing_top",
      "label": "t:sections.global.settings.spacing.settings.spacing_top.label",
      "options": [
        {
          "value": "0",
          "label": "No"
        },
        {
          "value": "1",
          "label": "S"
        },
        {
          "value": "2",
          "label": "M"
        },
        {
          "value": "4",
          "label": "L"
        },
        {
          "value": "6",
          "label": "XL"
        }
      ],
      "default": "2"
    },
    {
      "type": "select",
      "id": "spacing_bottom",
      "label": "t:sections.global.settings.spacing.settings.spacing_bottom.label",
      "options": [
        {
          "value": "0",
          "label": "No"
        },
        {
          "value": "1",
          "label": "S"
        },
        {
          "value": "2",
          "label": "M"
        },
        {
          "value": "4",
          "label": "L"
        },
        {
          "value": "6",
          "label": "XL"
        }
      ],
      "default": "2"
    }
  ],
  "blocks": [
    {
      "type": "testimonial",
      "name": "t:sections.testimonials.blocks.testimonial.name",
      "settings": [
        {
          "type": "header",
          "content": "t:sections.global.header.text.content"
        },
        {
          "type": "text",
          "id": "author",
          "label": "t:sections.testimonials.blocks.testimonial.settings.author.label",
          "default": "Jane Doe"
        },
        {
          "type": "richtext",
          "id": "quote",
          "label": "t:sections.testimonials.blocks.testimonial.settings.quote.label",
          "default": "<p>“I absolutely love the quality of my Leo Bikini Bottoms.”</p>"
        },
        {
          "type": "range",
          "id": "rating_score",
          "min": 0,
          "max": 5,
          "step": 1,
          "label": "t:sections.testimonials.blocks.testimonial.settings.rating_score.label",
          "default": 5
        },
        {
          "type": "header",
          "content": "t:sections.global.header.settings.content",
          "info": "t:sections.global.header.settings.info"
        },
        {
          "type": "color_scheme",
          "id": "color_scheme",
          "default": "scheme-1",
          "label": "t:sections.global.color_scheme.label"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "t:sections.testimonials.name",
      "blocks": [
        {
          "type": "testimonial"
        },
        {
          "type": "testimonial"
        }
      ]
    }
  ]
}
{% endschema %}

###component-card-slider.cs
card-slider {
  display: block;
}

html .card-slider {
  overflow: visible;
}

.card-slider__buttons {
  position: static;
  margin-block-start: 3.2rem;
  transform: none;
  justify-content: flex-end;
  padding: 0;
}

.card-slider .card-slider__slide {
  width: calc(100% - 16.666%);
}

html.no-js .card-slider__wrapper {
  overflow-x: auto;
  margin: 0 calc(0rem - var(--page-gutter));
  padding: 0 var(--page-gutter) 2rem;
}

html.no-js .card-slider__slide + .card-slider__slide {
  margin-inline-start: .2rem;
}

@media screen and (min-width: 575px) {
  .card-slider .card-slider__slide {
    width: calc(100% - 33.333%);
  }

  .card-slider--articles .card-slider__slide {
    width: calc(50% - .2rem);
  }

  .card-slider.card-slider--testimonials .card-slider__slide {
    width: 100%;
    height: auto;
  }

}

@media screen and (min-width: 750px) {
  html.js .card-slider {
    overflow: hidden;
  }

  html.js .layout-2 .card-slider {
    overflow: unset;
  }

  .card-slider .card-slider__slide {
    width: calc(100% / 3 - .2rem);
  }

  .card-slider--testimonials .card-slider__buttons {
    column-gap: 2.4rem;
  }

  .card-slider--testimonials:not(.no-image) .card-slider__buttons::before {
    content: '';
    visibility: hidden;
    width: 0;
  }

  .card-slider--testimonials .card-slider__buttons-inner {
    display: flex;
    justify-content: flex-start;
  }

  .card-slider--testimonials.no-image .card-slider__buttons {
    margin-block-start: 4rem;
  }

  .card-slider--testimonials.no-image .card-slider__buttons-inner {
    justify-content: center;
    flex: 1;
  }

  .card-slider--testimonials.image-end .card-slider__buttons-inner {
    order: -1;
  }
}

@media screen and (min-width: 990px) {
  .card-slider--testimonials.no-image .card-slider__buttons {
    margin-block-start: 6.4rem;
  }

  .card-slider--testimonials .card-slider__buttons {
    column-gap: 4.8rem;
  }
}

@media screen and (min-width: 1100px) {
  .card-slider--testimonials .card-slider__buttons {
    column-gap: 18.1%;
  }
}

## section-testimonials.css

.section-testimonials .section__heading {
  margin-block-end: 4.8rem;
}

.section-testimonials--horizontal-w-media,
.section-testimonials--vertical-w-media {
  display: flex;
  align-items: center;
  gap: calc(var(--section-spacing-unit-size) * 1);
}

.section-testimonials .position--image-start {
  flex-direction: column;
}

.section-testimonials .position--image-end {
  flex-direction: column-reverse;
}

.section-testimonials--horizontal-w-media .testimonials__content,
.section-testimonials--vertical-w-media .testimonials__content {
  width: 100%;
  padding: 6.4rem 0;
}

.container.max-w-full .testimonials__content {
  padding-inline: 1.6rem;
}

.section-testimonials__ratings {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  margin-block-end: 1.6rem;
}

.section-testimonials__ratings svg path {
  fill: rgb(var(--color-heading-text));
  stroke: rgb(var(--color-heading-text));
}

.section-testimonials__subheading {
  display: block;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  font-size: var(--font-size-static-sm);
  margin-block-end: 2.8rem;
}

.section-testimonials__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-block-start: 3.6rem;
  flex-direction: column;
  gap: 20px;
}

.section-testimonials__footer .section-testimonials__footer--arrow-button {
  display: none;
}

.section-testimonials .swiper-buttons {
  margin-block-start: 0;
}

.section-testimonials .swiper-buttons .swiper-button {
  width: 2.4rem;
  height: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--button-action-border-radius, 0.6rem);
}

.section-testimonials .swiper-buttons .icon {
  width: 1.2rem;
  height: 1.2rem;
}

.section-testimonials .swiper-buttons .swiper-button--prev {
  margin-inline-end: 1.2rem;
}


.section-testimonials .swiper-buttons {
  display: block;
}
.card-slider__buttons-inner {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem; /* spacing between buttons */
  margin-top: 1rem;
}

.card-slider__buttons-inner .swiper-button {
  width: 2.4rem;
  height: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--button-action-border-radius, 0.6rem);
}

/* Optional: Slightly smaller buttons on small screens */
@media screen and (max-width: 768px) {
  .card-slider__buttons-inner {
    gap: 0.8rem;
  }

  .card-slider__buttons-inner .swiper-button {
    width: 2rem;
    height: 2rem;
  }
}

.section-testimonials__footer .swiper-pagination-progressbar {
  position: unset;
  margin-block-start: 3.6rem;
  width: 10rem;
  height: 0.2rem;
 
}

.section-testimonials__footer .swiper-pagination-progressbar .swiper-pagination-progressbar-fill {
  background: rgb(var(--color-progress-bar));
}

.testimonial__rating-circle {
  display: inline-block;
  border-radius: 100%;
  width: 0.8rem;
  height: 0.8rem;
  background: rgb(var(--color-rating-stars));
  opacity: .2;
}

.testimonial__rating-circle.circle-filled {
  opacity: 1;
}

.section-testimonials--carousel-none-media .testimonials__media {
  display: none;
}

.section-testimonials--carousel-none-media .section-testimonials__footer {
  justify-content: center;
}

.testimonial__body {
  min-height: 19.4rem;
}

.card-slider.card-slider--testimonials.vertical-w-media .card-slider__slide {
  min-height: 19.4rem;
}
.card-slider .card-slider__slide:only-child {
  width: 100%;
}

.testimonials__block {
  height: auto;
}

.testimonials__block blockquote {
  margin: 0;
  padding: 0;
  font-style: normal;
  border: none;
}

.testimonials__block blockquote p {
  margin-block: 1.6rem 0;
  letter-spacing: 0.02em;
}

.testimonial__author {
  font-size: var(--font-size-static-h7);
  font-style: normal;
}

.testimonial__body {
  background: rgb(var(--color-background));
  border-radius: var(--card-corner-radius);
  height: 100%;
  overflow: auto;
  padding: calc(var(--block-padding) * 1) calc(var(--block-padding) * 1.5);
}

.testimonial__body::-webkit-scrollbar {
  width: 0.2rem;
}

.testimonial__body::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8em;
}

.testimonial__body::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 8rem;
}

.testimonial__body::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.5);
}

.testimonial__rating {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-block-start: 0.4rem;
}

.testimonial__box {
  height: 100%;
}

.testimonial__rating-filled svg {
  fill: rgb(var(--color-rating-stars));
  stroke: rgb(var(--color-rating-stars));
}

@media screen and (min-width: 575px) {
  .testimonials__quote {
    font-size: var(--font-size-static-xl);
  }
}

@media screen and (max-width: 749px) {
  .section-testimonials .vertical-w-media .swiper-pagination {
    display: none;
  }
}

@media screen and (min-width: 750px) {

  .section-testimonials .position--image-start {
    flex-direction: row;
  }

  .section-testimonials .position--image-end {
    flex-direction: row-reverse;
  }

  .section-testimonials--vertical-w-media .autoplay-progress {
    display: none;
  }

  html .card-slider.card-slider--testimonials {
    overflow: visible;
  }

  .testimonial.no-image {
    display: block;
    text-align: center;
  }

  .testimonial.no-image .testimonial__content {
    margin: 0 auto;
  }

  .testimonial.image-end .testimonial__link {
    justify-content: flex-end;
  }

  .testimonials__quote {
    font-size: var(--font-size-static-xxl);
    line-height: var(--line-height-static-sm);
  }

  .testimonial__link {
    display: flex;
  }

  .section-testimonials--horizontal-w-media:has(.testimonials__media.large-up-hide) .testimonials__content,
  .section-testimonials--vertical-w-media:has(.testimonials__media.large-up-hide) .testimonials__content {
    width: 100%;
    padding-inline: 0;
  }
}

@media screen and (min-width: 990px) {
  html .card-slider.card-slider--testimonials {
    overflow: hidden;
  }
  html .card-slider.card-slider--testimonials.carousel-none-media {
    overflow: visible;
  }
  .section-testimonials--carousel-none-media .testimonials__content {
    padding: 1.2rem 3.6rem;
  }

  .section-testimonials--horizontal-w-media .testimonials__content,
  .section-testimonials--vertical-w-media .testimonials__content {
    width: 50%;
    padding: 6.4rem 0;
  }

  .section-testimonials .max-w-full .testimonials__content {
    padding-inline: 0;
  }

  .section-testimonials--horizontal-w-media .testimonials__content-in,
  .section-testimonials--vertical-w-media .testimonials__content-in {
    max-width: 43.7rem;
    width: 100%;
    margin: 0 auto;
  }

  .section-testimonials--horizontal-w-media .swiper-buttons {
    display: block;
  }

  .testimonials__media {
    display: inline;
    width: 50%;
    aspect-ratio: var(--media-aspect-ratio);
  }
  .section-testimonials__footer {
    justify-content: space-between;
  }
  .section-testimonials__footer .section-testimonials__footer--arrow-button {
    display: block;
  }
  .section-testimonials--vertical-w-media .swiper-wrapper {
    max-height: 75rem;
  }

  .section-testimonials--vertical-w-media .section-testimonials__footer {
    margin-block-start: 4.8rem;
    justify-content: center;
    gap: 1.6rem;
  }
  .section-testimonials--vertical-w-media .swiper-pagination {
    position: initial;
    --swiper-pagination-color: transparent;
    --swiper-pagination-bullet-height: 0.1rem;
    --swiper-pagination-bullet-horizontal-gap: 0.8rem;
    --swiper-pagination-bullet-width: 2.4rem;
  }
  .section-testimonials--vertical-w-media .swiper-pagination .swiper-pagination-bullet {
    font-size: var(--font-size-static-md);
    --swiper-pagination-bullet-inactive-color: transparent;

  }
  .section-testimonials--vertical-w-media .swiper-pagination-bullet::after {
    content: '';
    display: block;
    width: 2.4rem;
    height: 0.1rem;
    position: absolute;
    inset-block-end: -0.08rem;
    background-color: rgba(var(--color-foreground), 1);
  }
  .section-testimonials--vertical-w-media .swiper-pagination-horizontal {
    width: auto;
  }

  .testimonial__body {
    padding: calc(var(--block-padding) * 1.5);
  }

  .testimonials__quote {
    font-size: var(--font-size-static-h4);
    margin-block-end: 2.4rem;
  }
}


.autoplay-progress {
  position: absolute;
  inset-inline: auto;
  inset-block-end: 1.6rem;
  z-index: 10;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  color: var(--swiper-theme-color);
}
.autoplay-progress--line {
  width: 10rem;
  height: 1rem;
}

.autoplay-progress svg {
  --progress: 0;
  position: absolute;
  inset-block-start: 0px;
  inset-inline-start: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  stroke-width: 4px;
  stroke: var(--swiper-theme-color);
  fill: none;
  stroke-dashoffset: calc(125.6px * (1 - var(--progress)));
  stroke-dasharray: 125.6;
  transform: rotate(-90deg);
}

.autoplay-progress--line svg {
  transform: rotate(0deg);
}

.autoplay-progress--line line {
  stroke-dashoffset: calc(100px * (1 - var(--progress)));
  stroke-dasharray: 100;
  transform-origin: 0 50%;
  transform: scaleX(var(--progress));
}

.section-testimonials .autoplay-progress {
  position: relative;
  inset-block-end: 0;
  --swiper-theme-color: rgb(var(--color-foreground));
  height: 0.4rem;
  background-color: rgba(var(--color-foreground), 0.1);
}

.section-testimonials .autoplay-progress span {
  display: none;
}

##card-slider.js


if (!customElements.get("card-slider")) {
  class CardSlider extends HTMLElement {
    constructor() {
      super();

      const swiperOptions = JSON.parse(this.getAttribute("data-swiper-options")) || {};

      window.addEventListener("shopify:section:load", () => {
        this.initSlider(swiperOptions);
      });

      this.initSlider(swiperOptions);

      if (this.classList.contains("js-testimonials")) {
        const initOrUpdateSlider = () => {
          const isMobile = window.innerWidth < mobileWidth;
          const isSlideEffect = this.slider && this.slider.params.effect === "slide";

          if ((isMobile && !isSlideEffect) || (!isMobile && isSlideEffect)) {
            this.reInitSlider(swiperOptions);
          }
        };

        initOrUpdateSlider();

        window.addEventListener("resize", initOrUpdateSlider);
      }

      // if window is resized, re-init slider
      window.addEventListener("resize", () => {
        if (swiperOptions.disabledOnMobile && window.innerWidth < mobileWidth) {
          if (this.slider) {
            this.slider.destroy();
          }
        } else if (!this.slider) {
          this.initSlider(swiperOptions);
        }
      });
    }

    reInitSlider(swiperOptions) {
      this.slider.destroy();
      this.initSlider(swiperOptions);
    }

    initSlider(swiperOptions) {
      const progressCircle = document.querySelector(
        `.autoplay-progress--${swiperOptions.sectionId} svg`
      );
      const progressContent = document.querySelector(
        `.autoplay-progress--${swiperOptions.sectionId} span`
      );

      // swiperOptions.disabledOnMobile = true;
      if (
        swiperOptions.disabledOnMobile &&
        window.innerWidth < mobileWidth
      ) {
        return;
      }

      // Swiper Pagination Option
      if (swiperOptions.pagination == "render_bullet") {
        swiperOptions.pagination = {
          el: ".swiper-pagination",
          clickable: true,
          renderBullet: function (i, className) {
            return `
              <button class="${className}">
                <span>${i + 1}</span>
              </button>
            `;
          }
        };
      } else if (swiperOptions.pagination == "progressbar") {
        swiperOptions.pagination = {
          el: ".swiper-pagination",
          type: "progressbar"
        };
      } else if (swiperOptions.pagination == "bullets") {
        swiperOptions.pagination = {
          el: ".swiper-pagination",
          clickable: true
        };
      } else {
        swiperOptions.pagination = false;
      }

      // Swiper Loop Option Check - if swiperOptions.slideCount is less than 2, then loop is disabled
      if (swiperOptions.loop && swiperOptions.slideCount < 2) {
        swiperOptions.loop = false;
      }

      let sliderOptions = {
        slidesPerView: swiperOptions.slidesPerView || 1.1,
        spaceBetween: swiperOptions.spaceBetweenMobile || 16,
        resistanceRatio: 0.72,
        navigation: swiperOptions.navigation || { nextEl: ".swiper-button--next", prevEl: ".swiper-button--prev" },
        breakpoints: {
          480: {
            slidesPerView: "auto",
            spaceBetween: swiperOptions.spaceBetweenMobile || 2
          },
          750: {
            slidesPerView: swiperOptions.slidesPerViewDesktop || 3,
            spaceBetween: swiperOptions.spaceBetweenDesktop || 16
          }
        }
      };

      const isArticlesSlider = this.classList.contains("js-articles");
      const isCollectionSlider =
        this.classList.contains("js-collections");
      const isFeaturedProductsSlider = this.classList.contains(
        "js-featured-products"
      );

      if (isArticlesSlider || isCollectionSlider || isFeaturedProductsSlider) {
        sliderOptions.breakpoints[575] = {
          slidesPerView: 2
        };
      } else if (this.classList.contains("horizontal-w-media")) {
        sliderOptions = {
          slidesPerView: swiperOptions.slidesPerView || 1.1,
          rewind: swiperOptions.rewind || false,
          followFinger: swiperOptions.followFinger || false,
          spaceBetween: swiperOptions.spaceBetweenMobile || 16,
          pagination: swiperOptions.pagination || false,
          navigation: swiperOptions.navigation || {
            nextEl: ".swiper-button--next",
            prevEl: ".swiper-button--prev"
          },
          loop: swiperOptions.loop || false,
          autoplay: swiperOptions.autoplay || false,
          breakpoints: {
            750: {
              slidesPerView: 2.2,
              spaceBetween: swiperOptions.spaceBetweenDesktop || 16
            },
            990: {
              slidesPerView: 1
            }
          },
          on: {
            autoplayTimeLeft(_s, time, progress) {
              progressCircle.style.setProperty("--progress", 1 - progress);
              progressContent.textContent = `${Math.ceil(time / 1000)}s`;
            }
          }
        };
      } else if (this.classList.contains("vertical-w-media")) {

        if (window.innerWidth > 750) {

        sliderOptions = {
          slidesPerView: swiperOptions.slidesPerView || 1.1,
          rewind: swiperOptions.rewind || false,
          followFinger: swiperOptions.followFinger || false,
          spaceBetween: swiperOptions.spaceBetweenMobile || 16,
          pagination: {
            el: ".swiper-pagination",
            clickable: true,
            renderBullet: function (i, className) {
              return `<button class="${className}"><span>${
                i + 1
              }</span></button>`;
            }
          },
          navigation: swiperOptions.navigation || {
            nextEl: ".swiper-button--next",
            prevEl: ".swiper-button--prev"
          },
          loop: swiperOptions.loop || false,
          autoplay: swiperOptions.autoplay || false,
          breakpoints: {
            750: {
              slidesPerView: 2.2,
              spaceBetween: swiperOptions.spaceBetweenDesktop || 16,
              pagination: {
                el: ".swiper-pagination",
                clickable: true,
                renderBullet: function (i, className) {
                  return `<button class="${className}"><span>${
                    i + 1
                  }</span></button>`;
                }
              }
            },
            990: {
              slidesPerView: 1,
              grid: {
                rows: 3
              }
            }
          }
        };

      } else {
        sliderOptions = {
          slidesPerView: swiperOptions.slidesPerView || 1.1,
          rewind: swiperOptions.rewind || false,
          followFinger: swiperOptions.followFinger || false,
          spaceBetween: swiperOptions.spaceBetweenMobile || 16,
          navigation: swiperOptions.navigation || {
            nextEl: ".swiper-button--next",
            prevEl: ".swiper-button--prev"
          },
          loop: swiperOptions.loop || false,
          autoplay: swiperOptions.autoplay || false,
          on: {
            autoplayTimeLeft(_s, time, progress) {
              progressCircle.style.setProperty(
                "--progress",
                1 - progress
              );
              progressContent.textContent = `${Math.ceil(
                time / 1000
              )}s`;
            }
          }
        };
      }


      } else if (this.classList.contains("carousel-none-media")) {
        sliderOptions = {
          slidesPerView: swiperOptions.slidesPerView || 1.1,
          rewind: swiperOptions.rewind || false,
          followFinger: swiperOptions.followFinger || false,
          spaceBetween: swiperOptions.spaceBetweenMobile || 16,
          pagination: swiperOptions.pagination || false,
          navigation: swiperOptions.navigation || {
            nextEl: ".swiper-button--next",
            prevEl: ".swiper-button--prev"
          },
          loop: swiperOptions.loop || false,
          autoplay: swiperOptions.autoplay || false,
          breakpoints: {
            750: {
              slidesPerView: 2.2,
              spaceBetween: swiperOptions.spaceBetweenDesktop || 16
            },
            990: {
              slidesPerView: 3.2
            }
          },
          on: {
            autoplayTimeLeft(_s, time, progress) {
              progressCircle.style.setProperty(
                "--progress",
                1 - progress
              );
              progressContent.textContent = `${Math.ceil(
                time / 1000
              )}s`;
            }
          }
        };
      } else {
        sliderOptions = {
          effect: "fade",
          slidesPerView: 1,
          rewind: true,
          followFinger: false,
          navigation: {
            nextEl: ".swiper-button--next",
            prevEl: ".swiper-button--prev"
          }
        };
      }

      this.slider = new Swiper(this, sliderOptions);
    }
  }

  customElements.define("card-slider", CardSlider);
}
