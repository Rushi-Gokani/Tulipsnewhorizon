{%- liquid
  render 'css', css: 'section-announcement-bar.css'

  assign text_slide_blocks = section.blocks | where: 'type', 'text-slide'

  if section.settings.text_block_behaviour == 'marquee'
    render 'css', css: 'section-marquees.css'

    assign marquee_duration_rate = section.settings.slider_autoplay_interval | times: 10
    assign marquee_duration = text_slide_blocks.size | times: marquee_duration_rate
  endif
-%}

{%- style -%}
  #shopify-section-{{ section.id }}:has(.has-offset) {
    --section-announcement-bar-offset: {{ section.settings.section_offset }}px;
  }
  #shopify-section-{{ section.id }} .text--label,
  #shopify-section-{{ section.id }} .text--link,
  #shopify-section-{{ section.id }} .countdown-timer__message {
    font-weight: {{ section.settings.font_weight }};
  }
  {%- if section.settings.text_block_behaviour == 'marquee' -%}
    #shopify-section-{{ section.id }} > div {
      --marquee-duration: {{ marquee_duration | times: 1 }}s;
    }
    #shopify-section-{{ section.id }} > .swiper-wrapper {
      transition-timing-function: linear;
    }
    @media screen and (min-width: 750px) {
      #shopify-section-{{ section.id }} > div {
        --marquee-duration: {{ marquee_duration }}s;
      }
    }
  {%- endif -%}
{%- endstyle -%}

{%- if section.settings.text_block_behaviour != 'marquee' -%}
  <script src="{{- 'announcement-bar-slider.js' | asset_url -}}" defer="defer"></script>
  {% capture data_swiper_options %}
    data-swiper-options = '{
      {%- if section.settings.text_block_behaviour == 'static' -%}
        "slidesPerView": 1,
        "slidesPerViewDesktop": {{ text_slide_blocks.size }},
        "loop": false,
        "autoplay": {
          "delay": {{ section.settings.slider_autoplay_interval | times: 1000 }}
        }
      {%- elsif section.settings.text_block_behaviour == 'slider' -%}
        "slidesPerViewDesktop": 1,
        "loop": true,
        "autoplay": {
          "delay": {{ section.settings.slider_autoplay_interval | times: 1000 }}
        }
      {%- else -%}
        "loop": false,
        "autoplay": false
      {%- endif -%}
    }'
  {% endcapture %}
{% endif %}

{%- capture announcement_bar_slideshow -%}
  {%- if text_slide_blocks.size == 1 -%}
    <div class="announcement-bar__slider">
      <div class="announcement-bar__text-content text--label icon">
        {% render 'icon', icon_name: text_slide_blocks.first.settings.icon, custom_icon: text_slide_blocks.first.settings.custom_icon %}
        {{ text_slide_blocks.first.settings.content }}
      </div>
    </div>
  {%- else -%}
    {% if section.settings.text_block_behaviour != 'marquee' %}
      <announcement-bar-slider
        class='swiper announcement-bar__slider'
        data-autoplay-interval='{{- section.settings.slider_autoplay_interval | times: 1000 -}}'
        {{ data_swiper_options | replace: ' ', '' | strip_newlines }}
      >
        <div class='swiper-wrapper'>
          {%- for block in text_slide_blocks -%}
            {%- if block.settings.content == blank -%}
              {%- continue -%}
            {%- endif -%}
            <div class='swiper-slide'>
              <div class="announcement-bar__text-content text--label icon">
                {% render 'icon', icon_name: block.settings.icon, custom_icon: block.settings.custom_icon %}
                {{ block.settings.content }}
              </div>
            </div>
          {%- endfor -%}
        </div>
      </announcement-bar-slider>
    {% else %}
      <div class="announcement_bar__marquee marquee--hover-pause enable-animation">
        {% capture marquee_items %}
          {%- for block in text_slide_blocks -%}
            {%- if block.settings.content == blank -%}
              {%- continue -%}
            {%- endif -%}
            <li class="marquee__item icon text--label">
              {% render 'icon', icon_name: block.settings.icon, custom_icon: block.settings.custom_icon %}
              {{ block.settings.content }}
            </li>
          {%- endfor -%}
        {% endcapture %}
        {% liquid
          assign marquee_items_size = text_slide_blocks.size | times: 1.0
          assign marquee_items_size_shoud_be = 12
          assign lower_limit = 1
          assign upper_limit = marquee_items_size_shoud_be | divided_by: marquee_items_size | ceil
        %}
        <ul class="marquee__content">
          {% for i in (lower_limit..upper_limit) -%}
            {{ marquee_items }}
          {%- endfor %}
        </ul>
        <ul aria-hidden="true" class="marquee__content">
          {% for i in (lower_limit..upper_limit) -%}
            {{ marquee_items }}
          {%- endfor %}
        </ul>
      </div>
    {% endif %}
  {%- endif -%}
{%- endcapture -%}

<div class="color-{{ section.settings.color_scheme }} gradient">
  <div class="announcement-bar bar js-announcement-bar{% if section.settings.section_offset != 0 %} has-offset{% endif %}">
    <div class='container {{ section.settings.section_width }}'>
      <div class='announcement-bar__wrapper'>
        {%- assign text_slide_count = 0 -%}
        {% for block in section.blocks %}

          {% liquid
            assign show_on_class = block.settings.show_on
            if show_on_class == 'mobile'
              assign show_on_class = 'large-up-hide'
            elsif show_on_class == 'desktop'
              assign show_on_class = 'small-hide medium-hide'
            else
              assign show_on_class = ''
            endif
          %}

          {%- case block.type -%}
            {%- when 'link' -%}
              <a href="{{ block.settings.link }}" class="announcement-bar__link icon text--link {{ show_on_class }}" aria-label="{{ block.settings.link_label }}">
                {% liquid
                  assign icon_alt = block.settings.link_label
                  render 'icon', icon_name: block.settings.icon, custom_icon: block.settings.custom_icon, icon_alt: icon_alt
                %}
                {{ block.settings.link_label }}
              </a>

            {%- when 'text-slide' -%}
              {%- assign text_slide_count = text_slide_count | plus: 1 -%}
              {%- if text_slide_count == 1 -%}
                {%- if block.settings.content == blank -%}
                  {%- continue -%}
                {%- endif -%}

                {{ announcement_bar_slideshow }}
              {%- endif -%}

            {%- when 'timer' -%}
              <div class="announcement-bar__timer text--label {{ show_on_class }}" {{ block.shopify_attributes }}>
                {%- render 'countdown-timer',
                  id: block.id,
                  column_type: 'row',
                  custom_text: 'Ends in',
                  timer_text_first_letter: true,
                  timezone: settings.timezone,
                  timer_year: block.settings.timer_year,
                  timer_month: block.settings.timer_month,
                  timer_day: block.settings.timer_day,
                  timer_hour: block.settings.timer_hour,
                  timer_minute: block.settings.timer_minute,
                  show_timer_days: block.settings.show_timer_days,
                  show_timer_hours: block.settings.show_timer_hours,
                  show_timer_minutes: block.settings.show_timer_minutes,
                  show_timer_seconds: block.settings.show_timer_seconds,
                  timer_end_message: block.settings.timer_end_message,
                  timer_layout: 2
                -%}
              </div>
            {%- when 'localization' -%}
              <div class="announcement-bar__localization {{ show_on_class }}" {{ block.shopify_attributes }}>
                <menu-drawer>
                  {%- render 'country-drawer', append_id: 'announcement-' | append: block.id -%}
                </menu-drawer>
              </div>
          {%- endcase -%}
        {% endfor %}
      </div>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "t:sections.announcement-bar.name",
  "tag": "section",
  "class": "section-announcement-bar",
  "settings": [
    {
      "type": "select",
      "id": "text_block_behaviour",
      "label": "t:sections.announcement-bar.settings.text_block_behaviour.label",
      "options": [
        {
          "value": "static",
          "label": "t:sections.announcement-bar.settings.text_block_behaviour.options.options__1.label"
        },
        {
          "value": "marquee",
          "label": "t:sections.announcement-bar.settings.text_block_behaviour.options.options__2.label"
        },
        {
          "value": "slider",
          "label": "t:sections.announcement-bar.settings.text_block_behaviour.options.options__3.label"
        }
      ],
      "default": "slider"
    },
    {
      "type": "range",
      "id": "slider_autoplay_interval",
      "min": 1,
      "max": 10,
      "step": 1,
      "unit": "s",
      "label": "t:sections.announcement-bar.settings.slider_autoplay_interval.label",
      "default": 3
    },
    {
      "type": "header",
      "content": "t:sections.global.header.fine_tuning.content",
      "info": "t:sections.global.header.fine_tuning.info"
    },
    {
      "type": "select",
      "id": "font_weight",
      "label": "t:sections.global.element.font.weight.label",
      "options": [
        {
          "value": "400",
          "label": "t:sections.global.element.font.weight.options.normal.label"
        },
        {
          "value": "500",
          "label": "t:sections.global.element.font.weight.options.medium.label"
        },
        {
          "value": "700",
          "label": "t:sections.global.element.font.weight.options.bold.label"
        }
      ],
      "default": "700"
    },
    {
      "type": "number",
      "id": "section_offset",
      "label": "t:sections.global.section.offset.label",
      "info": "t:sections.global.section.offset.info",
      "default": 0
    },
    {
      "type": "header",
      "content": "t:sections.global.header.settings.content",
      "info": "t:sections.global.header.settings.info"
    },
    {
      "type": "select",
      "id": "section_width",
      "label": "t:sections.global.section_width.label",
      "options": [
        {
          "value": "max-w-page",
          "label": "t:sections.global.section_width.options.page.label"
        },
        {
          "value": "max-w-fluid",
          "label": "t:sections.global.section_width.options.fluid.label"
        },
        {
          "value": "max-w-full",
          "label": "t:sections.global.section_width.options.full.label"
        }
      ],
      "default": "max-w-fluid"
    },
    {
      "type": "color_scheme",
      "id": "color_scheme",
      "label": "t:sections.global.color_scheme.label",
      "default": "scheme-2"
    }
  ],
  "blocks": [
    {
      "type": "link",
      "name": "t:sections.announcement-bar.blocks.link.name",
      "limit": 2,
      "settings": [
        {
          "type": "select",
          "id": "show_on",
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
          "type": "text",
          "id": "link_label",
          "label": "t:sections.global.element.link_label.label",
          "default": "Link 1"
        },
        {
          "type": "url",
          "id": "link",
          "label": "t:sections.global.element.link.label",
          "default": "/"
        },
        {
          "type": "text",
          "id": "icon",
          "label": "t:sections.global.element.icon.label",
          "info": "t:sections.global.element.icon.info",
          "default": "theme-box"
        },
        {
          "type": "image_picker",
          "id": "custom_icon",
          "label": "t:sections.global.element.icon.custom_icon.label",
          "info": "t:sections.global.element.icon.custom_icon.info"
        }
      ]
    },
    {
      "type": "timer",
      "name": "t:sections.announcement-bar.blocks.timer.name",
      "limit": 1,
      "settings": [
        {
          "type": "select",
          "id": "show_on",
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
          "type": "number",
          "id": "timer_year",
          "label": "t:sections.global.settings.timer.settings.timer_year.label",
          "default": 2024
        },
        {
          "type": "select",
          "id": "timer_month",
          "label": "t:sections.global.settings.timer.settings.timer_month.label",
          "options": [
            {
              "value": "01",
              "label": "t:sections.global.settings.timer.settings.timer_month.options.options__1"
            },
            {
              "value": "02",
              "label": "t:sections.global.settings.timer.settings.timer_month.options.options__2"
            },
            {
              "value": "03",
              "label": "t:sections.global.settings.timer.settings.timer_month.options.options__3"
            },
            {
              "value": "04",
              "label": "t:sections.global.settings.timer.settings.timer_month.options.options__4"
            },
            {
              "value": "05",
              "label": "t:sections.global.settings.timer.settings.timer_month.options.options__5"
            },
            {
              "value": "06",
              "label": "t:sections.global.settings.timer.settings.timer_month.options.options__6"
            },
            {
              "value": "07",
              "label": "t:sections.global.settings.timer.settings.timer_month.options.options__7"
            },
            {
              "value": "08",
              "label": "t:sections.global.settings.timer.settings.timer_month.options.options__8"
            },
            {
              "value": "09",
              "label": "t:sections.global.settings.timer.settings.timer_month.options.options__9"
            },
            {
              "value": "10",
              "label": "t:sections.global.settings.timer.settings.timer_month.options.options__10"
            },
            {
              "value": "11",
              "label": "t:sections.global.settings.timer.settings.timer_month.options.options__11"
            },
            {
              "value": "12",
              "label": "t:sections.global.settings.timer.settings.timer_month.options.options__12"
            }
          ],
          "default": "01"
        },
        {
          "type": "range",
          "id": "timer_day",
          "label": "t:sections.global.settings.timer.settings.timer_day.label",
          "min": 1,
          "max": 31,
          "step": 1,
          "default": 1
        },
        {
          "type": "range",
          "id": "timer_hour",
          "label": "t:sections.global.settings.timer.settings.timer_hour.label",
          "min": 0,
          "max": 23,
          "step": 1,
          "default": 0,
          "unit": "h"
        },
        {
          "type": "range",
          "id": "timer_minute",
          "label": "t:sections.global.settings.timer.settings.timer_minute.label",
          "min": 0,
          "max": 59,
          "step": 1,
          "default": 0,
          "unit": "m"
        },
        {
          "type": "inline_richtext",
          "id": "timer_end_message",
          "label": "t:sections.callout-banner.settings.timer_end_message.label",
          "info": "t:sections.callout-banner.settings.timer_end_message.info",
          "default": "Sale has ended"
        },
        {
          "type": "header",
          "content": "t:sections.global.header.parts_display_settings.content"
        },
        {
          "type": "checkbox",
          "id": "show_timer_days",
          "label": "t:sections.global.settings.timer.settings.show_timer_days.label",
          "default": true
        },
        {
          "type": "checkbox",
          "id": "show_timer_hours",
          "label": "t:sections.global.settings.timer.settings.show_timer_hours.label",
          "default": true
        },
        {
          "type": "checkbox",
          "id": "show_timer_minutes",
          "label": "t:sections.global.settings.timer.settings.show_timer_minutes.label",
          "default": true
        },
        {
          "type": "checkbox",
          "id": "show_timer_seconds",
          "label": "t:sections.global.settings.timer.settings.show_timer_seconds.label",
          "default": true
        }
      ]
    },
    {
      "type": "localization",
      "name": "t:sections.global.settings.localization.name",
      "limit": 1,
      "settings": [
        {
          "type": "select",
          "id": "show_on",
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
        }
      ]
    },
    {
      "type": "text-slide",
      "name": "t:sections.announcement-bar.blocks.text-slide.name",
      "limit": 5,
      "settings": [
        {
          "type": "richtext",
          "id": "content",
          "label": "t:sections.announcement-bar.blocks.text-slide.settings.content.label",
          "default": "<p>Welcome to our store</p>"
        },
        {
          "type": "text",
          "id": "icon",
          "label": "t:sections.global.element.icon.label",
          "info": "t:sections.global.element.icon.info",
          "default": "theme-box"
        },
        {
          "type": "image_picker",
          "id": "custom_icon",
          "label": "t:sections.global.element.icon.custom_icon.label",
          "info": "t:sections.global.element.icon.custom_icon.info"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "t:sections.announcement-bar.name",
      "blocks": [
        {
          "type": "text-slide"
        }
      ]
    }
  ]
}
{% endschema %}




####CSSS

/* Marquee styles */
.marquee {
  position: relative;
  display: flex;
  overflow: hidden;
  user-select: none;
  gap: var(--gap);
}

.marquee__content {
  flex-shrink: 0;
  display: flex;
  justify-content: space-around;
  gap: var(--gap);
  min-width: 100%;
  font-family: var(--font-heading-family);
  font-weight: var(--font-heading-weight);
  color: var(--marquee-content-text-color, rgb(var(--color-heading-text)));
  font-size: var(--marquee-element-size);
  line-height: var(--marquee-element-line-height, 1.5);
  letter-spacing: -0.02em;

  margin: var(--marquee-element-margin, 1.6rem 0);
  padding: 0;
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(var(--marquee-transform-translate-x) - var(--gap)));
  }
}

/* Pause animation when reduced-motion is set */
@media (prefers-reduced-motion: reduce) {
  .marquee__content {
    animation-play-state: paused !important;
  }
}

/* Enable animation */
.enable-animation .marquee__content {
  --marquee-transform-translate-x: -100%;
  animation: marquee linear infinite;
  animation-duration: var(--marquee-duration);
}
[dir='rtl'] .enable-animation .marquee__content {
  --marquee-transform-translate-x: 100%;
}
/* Reverse animation */
.marquee--reverse .marquee__content {
  animation-direction: reverse;
}

/* Pause on hover */
.marquee--hover-pause:hover .marquee__content {
  animation-play-state: paused;
}

/* Attempt to size parent based on content. Keep in mind that the parent width is equal to both content containers that stretch to fill the parent. */
.marquee--fit-content {
  max-width: fit-content;
}

/* A fit-content sizing fix: Absolute position the duplicate container. This will set the size of the parent wrapper to a single child container. Shout out to Olavi's article that had this solution 👏 @link: https://olavihaapala.fi/2021/02/23/modern-marquee.html  */
.marquee--pos-absolute .marquee__content:last-child {
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
}

/* Enable position absolute animation on the duplicate content (last-child) */
.enable-animation .marquee--pos-absolute .marquee__content:last-child {
  --marquee-absolute-transform-translate-x: 100%;
  animation-name: marquee-absolute;
}
[dir='rtl'] .enable-animation .marquee--pos-absolute .marquee__content:last-child {
  --marquee-absolute-transform-translate-x: -100%;
}

@keyframes marquee-absolute {
  from {
    transform: translateX(calc(var(--marquee-absolute-transform-translate-x) + var(--gap)));
  }
  to {
    transform: translateX(0);
  }
}

/* Other page demo styles */
.marquee__content > * {
  flex: 0 0 auto;
  padding: var(--marquee-content-padding, .2rem 1.2rem);

  display: flex;
  align-items: center;
}

.marquee__link {
  display: flex;
  align-items: center;
}

.marquee__item {
  text-transform: uppercase;
}
.marquee__item svg, .marquee__item img {
  height: var(--marquee-element-size);
  margin-inline-end: var(--marquee-element-svg-margin-inline-end);
}

.marquee__product-card a {
  display: flex;
  align-items: center;
  justify-content: center;
}

.marquee__product-card-image {
  min-width: 10rem;
  min-height: 10rem;
}

.marquee__product-card-image img {
  margin-inline-end: 0;
  width: 100%;
  height: 100%;
}

.marquee__product-card-content {
  padding: 0 0 0 1.6rem;
  display: inline-flex;
  flex-direction: column;
  max-width: 16rem;
}

.marquee__product-card-content span {
  font-size: var(--font-size-static-sm);
  font-weight: var(--font-heading-weight);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: var(--line-height-static-sm);
  letter-spacing: -0.024rem;
}

.marquee__product-card-content button {
  width: fit-content;
  margin-block-start: 1.2rem;
  padding: 1.2rem 1.6rem;
  border: 0.1rem solid rgba(var(--color-border), var(--alpha-border));
}


.marquee__item:has(.marquee__countdown-timer) {
  min-width: 28.5rem;
}
.marquee__countdown-timer {
  position: relative;
}
.marquee__countdown-timer .countdown-timer__column {
  line-height: var(--line-height-static-xs);
}
.marquee__countdown-timer .countdown-timer__column.text {
  margin-inline-end: 0.8rem;
}
.marquee__countdown-timer .countdown-timer__column:not(.text)+.countdown-timer__column {
  margin-inline-start: 0.8rem;
  border-inline-start: 0.1rem solid rgb(var(--color-foreground));
  padding-inline-start: 0.8rem;
}



