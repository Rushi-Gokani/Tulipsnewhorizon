{%- if section.blocks.size > 0 -%}
  {{- 'section-hero-banner.css' | asset_url | stylesheet_tag -}}
  <script src="{{- 'hero-slider.js' | asset_url -}}" defer="defer"></script>

  {%- liquid
    if section.settings.slideshow_pagination_style == 'style-1'
      assign slide_progress_multiplier = 3200
    else
      assign slide_progress_multiplier = 2000
    endif
  -%}

  {% style %}
   
    #shopify-section-{{ section.id }} {
      /* --inner-height: {% unless section.index0 == 0 -%}100svh{% else %}calc({{ section.settings.slider_height | default: '100' | append: 'svh' }} - var(--hero-banner-top)){% endunless %}; */
      --slideshow-pagination-progress-time: {{ section.settings.slideshow_autoplay_interval | times: slide_progress_multiplier }}ms;
    }
    {% unless section.index0 == 0 -%}
      #shopify-section-{{ section.id }} .hero__inner {
        z-index: 1;
      }
    {% endunless %};
    {%- if section.settings.slideshow_autoplay_interval == 0 -%}
      #shopify-section-{{ section.id }} .progress,
      #shopify-section-{{ section.id }} .hero__swiper-pagination-horizontal::before,
      #shopify-section-{{ section.id }} .hero__swiper-pagination-horizontal::after {
        opacity: 0;
      }
      #shopify-section-{{ section.id }} .hero__swiper-pagination:not(.hero__swiper-pagination-horizontal) .swiper-pagination-bullet-active {
        border-color: transparent;
      }
    {%- endif -%}

    {%- if section.settings.floating_bar -%}
    .section-hero-banner + .section-marquees {
      --marquee-element-margin: 1.6rem 1.2rem;
    }

    .section-hero-banner + .section-marquees .marquee__content {
      --marquee-element-size: 1.2rem;
      --marquee-element-line-height: var(--line-height-static-sm);
      --marquee-element-letter-spacing: 0.24rem;
      --marquee-content-padding: 0 1.2rem;
    }

    @media screen and (min-width: 750px) {
    
      .section-hero-banner + .section-marquees {
        position: absolute;
        z-index: 1;
      }
    }
    {%- endif -%}

    {%- if section.settings.floating_bar -%}
        html.js:not(.shopify-design-mode) .section-hero-banner + .section-marquees .js-animation-fade-in {
          animation: none;
        }
        @media screen and (min-width: 750px) {
          .section-hero-banner + .section-marquees {
            margin-inline-start: 2rem;
            --marquee-element-margin: 1.6rem 0;
            border-radius: .8rem;
            overflow: auto;
          }
          .section-hero-banner + .section-marquees .gradient {
            border: 1px solid rgba(255, 255, 255, 0.20);
            background: rgba(255, 255, 255, 0.20);
            backdrop-filter: blur(10px);
            --marquee-content-text-color: #fff;
          }
        }
      {%- if section.settings.slideshow_pagination_style == 'style-1' -%}
        @media screen and (min-width: 750px) {
          .section-hero-banner + .section-marquees {
            width: calc(100% - 10.8rem);
            inset-block-start: calc(var(--hero-banner-bottom, {{ section.settings.slider_height | default: '100' | append: 'vh' }}) - 7.2rem);
          }
        }
      {%- else -%}
        .section-hero-banner + .section-marquees {
          width: 100%;
        }
        @media screen and (min-width: 750px) {
          .section-hero-banner + .section-marquees {
            width: calc(100% - 10.8rem);
            inset-block-start: calc(var(--hero-banner-bottom, {{ section.settings.slider_height | default: '100' | append: 'vh' }}) - 7.2rem);
          }
        }
      {%- endif -%}
    {%- else -%}
      .section-hero-banner + .section-marquees {
        --marquee-element-margin: 1.6rem 1.2rem;
        width: 100%
      }
    {%- endif -%}
    /* Mobile fallback video fix */
    .mobile-fallback-video iframe,
    .mobile-fallback-video video {
      position: relative !important;
      width: 100vw !important;
      height: auto !important;
      min-height: 100vh !important;
      transform: none !important;
      object-fit: cover !important;
    }

    /* @media screen and (min-width: 750px) {
      #shopify-section-{{ section.id }} .hero__inner,
      #shopify-section-{{ section.id }} .hero__content {
        height: var(--inner-height, 100vh);
      }
    } */
  {% endstyle %}

  {%- capture hero_slides -%}
    {%- for block in section.blocks -%}
      {%- if section.blocks.size > 1 -%}
        <div class="swiper-slide hero__swiper-slide color-{{ block.settings.color_scheme }} gradient" {{ block.shopify_attributes }} data-index="{{- forloop.index0 -}}">
      {%- endif -%}

      {%- capture hero_inner_setting_classes -%}
        align-{{ block.settings.content_alignment }} text-{{ block.settings.content_alignment }} justify-{{ block.settings.content_position }} align-{{ block.settings.content_alignment_mobile }}--mobile text-{{ block.settings.content_alignment_mobile }}--mobile justify-{{ block.settings.content_position_mobile }}--mobile
      {%- endcapture -%}

      {% liquid
        assign hero_enable_media_overlay = ''
        unless block.settings.enable_media_overlay_desktop
          assign hero_enable_media_overlay = hero_enable_media_overlay | append: ' small-up-hide-media-overlay'
        endunless
        unless block.settings.enable_media_overlay_mobile
          assign hero_enable_media_overlay = hero_enable_media_overlay | append: ' small-hide-media-overlay'
        endunless
      %}

      {%- liquid
        assign hero_inner_setting_classes = hero_inner_setting_classes | strip
        assign has_mobile_media = false

        unless block.settings.enable_media_overlay_desktop
          assign hero_inner_setting_classes = hero_inner_setting_classes | append: ' small-up-hide-media-overlay'
        endunless

        unless block.settings.enable_media_overlay_mobile
          assign hero_inner_setting_classes = hero_inner_setting_classes | append: ' small-hide-media-overlay'
        endunless

        if block.settings.video_external_mobile != blank or block.settings.video_mobile != blank or block.settings.image_mobile != blank
          assign has_mobile_media = true
        endif

        assign block_link = block.settings.link
        if block_link == blank and block.settings.button_link_1_type == 'card'
          assign block_link = block.settings.button_link_1
        endif
        assign header_menu_text_color = block.settings.header_menu_text_color.red | append: ', ' | append: block.settings.header_menu_text_color.green | append: ', ' | append: block.settings.header_menu_text_color.blue
      -%}

      {%- if forloop.first -%}
        {%- assign desktop_loading = 'eager' -%}
        {%- assign desktop_fetchpriority = 'high' -%}
      {%- else -%}
        {%- assign desktop_loading = 'lazy' -%}
        {%- assign desktop_fetchpriority = 'low' -%}
      {%- endif -%}
      {%- assign mobile_loading = desktop_loading -%}
      {%- assign mobile_fetchpriority = desktop_fetchpriority -%}

      <div class="hero__inner {{ block.settings.banner_layout }} {{ hero_enable_media_overlay | strip }}" data-header-menu-text-color="{{ header_menu_text_color }}">
        {% capture media_element %}
          {%- comment -%}Desktop media{%- endcomment -%}
          {%- if block.settings.video_external != blank -%}
            <div class="media media--16-9 media--overlay hero__media hero__media--desktop{% if has_mobile_media %} small-hide{% endif %}">
              {% render 'external-video', video: block.settings.video_external, title: block.settings.heading, youtube_container: true, controls: block.settings.show_controls_on_video %}
            </div>
          {%- elsif block.settings.video != blank -%}
            <div class="media media--16-9 media--overlay hero__media hero__media--desktop{% if has_mobile_media %} small-hide{% endif %}">
              {{- block.settings.video | video_tag: image_size: '2160x', loop: true, autoplay: true, muted: true, controls: block.settings.show_controls_on_video -}}
            </div>
          {%- else -%}
            <div class="media media--overlay hero__media {% if has_mobile_media %} small-hide{% endif %}">
              {%- if block.settings.image != blank -%}
                {%- if block_link != blank -%}
                  <a href="{{ block_link }}">
                {%- endif -%}
                  {%- render 'image', image: block.settings.image, width: 2160, alt: block.settings.image.alt | default: block.settings.heading, loading: desktop_loading, fetchpriority: desktop_fetchpriority -%}
                {%- if block_link != blank -%}
                  </a>
                {%- endif -%}
              {%- else -%}
                {{ 'lifestyle-1' | placeholder_svg_tag: 'placeholder-svg' }}
              {%- endif -%}
            </div>
          {%- endif -%}

        {%- comment -%}Mobile media{%- endcomment -%}
          {%- if has_mobile_media -%}
            {%- if block.settings.video_external_mobile != blank -%}
              <div class="media media--16-9 hero__media small-up-hide">
                {% render 'external-video', video: block.settings.video_external_mobile, title: block.settings.heading, youtube_container: true, controls: block.settings.show_controls_on_video_mobile %}
              </div>
            {%- elsif block.settings.video_mobile != blank -%}
              <div class="media media--16-9 hero__media small-up-hide">
                {{- block.settings.video_mobile | video_tag: image_size: '720x', loop: true, autoplay: true, muted: true, controls: block.settings.show_controls_on_video_mobile -}}
              </div>
            {%- elsif block.settings.image_mobile != blank -%}
              <div class="media media--overlay hero__media small-up-hide">
                {%- if block_link != blank -%}
                  <a href="{{ block_link }}">
                {%- endif -%}
                  {%- render 'image', image: block.settings.image_mobile, width: 1080, alt: block.settings.image_mobile.alt | default: block.settings.heading, loading: mobile_loading, fetchpriority: mobile_fetchpriority -%}
                {%- if block_link != blank -%}
                  </a>
                {%- endif -%}
              </div>
            {%- else -%}
              <!-- Fallback to desktop video on mobile without fixed aspect ratio -->
              <div class="media media--overlay hero__media small-up-hide mobile-fallback-video">
                {%- if block.settings.video_external != blank -%}
                  {% render 'external-video', video: block.settings.video_external, title: block.settings.heading, youtube_container: true, controls: block.settings.show_controls_on_video %}
                {%- elsif block.settings.video != blank -%}
                  {{- block.settings.video | video_tag: image_size: '2160x', loop: true, autoplay: true, muted: true, controls: block.settings.show_controls_on_video -}}
                {%- endif -%}
              </div>
            {%- endif -%}
          {%- endif -%}

        {% endcapture %}
        {%- if
          block.settings.heading != blank
            or
          block.settings.text != blank
            or
          block.settings.button_label != blank and block.settings.button_link != blank
        -%}
          {% capture content_element %}
            <div class="hero__content {{ hero_inner_setting_classes | strip }}">
              {%- if block.settings.subheading != blank -%}
                <p class="hero__subheading">
                  {%- if block.settings.subheading_link != blank -%}
                    <a href="{{- block.settings.subheading_link -}}">
                      {{- block.settings.subheading -}}
                    </a>
                  {%- else -%}
                    {{- block.settings.subheading -}}
                  {%- endif -%}
                </p>
              {%- endif -%}

              {% liquid
                if section.index == 1 and forloop.index == 1
                  assign heading_tag = 'h1'
                else
                  assign heading_tag = 'h2'
                endif
              %}

              {%- if block.settings.heading != blank -%}
                <{{ heading_tag }} class="hero__heading">
                  {{- block.settings.heading -}}
                </{{ heading_tag }}>
              {%- endif -%}

              {%- if block.settings.text != blank -%}
                <div class="hero__entry entry{% unless block.settings.content_position contains 'start' %} entry--list-padding-none{% endunless %}">
                  {{- block.settings.text -}}
                </div>
              {%- endif -%}

              {%- if block.settings.button_label_1 != blank or block.settings.button_label_2 -%}
                <div class="hero__button">
                  {%- if block.settings.button_label_1 != blank -%}
                    {%- render 'button',
                      type: 'link',
                      class: 'button',
                      button_style: block.settings.button_style_1,
                      value: block.settings.button_label_1,
                      href: block.settings.button_link_1
                    -%}
                  {%- endif -%}
                  {%- if block.settings.button_label_2 != blank -%}
                    {%- render 'button',
                      type: 'link',
                      class: 'button',
                      button_style: block.settings.button_style_2,
                      value: block.settings.button_label_2,
                      href: block.settings.button_link_2
                    -%}
                  {%- endif -%}
                </div>
              {%- endif -%}
            </div>
          {% endcapture %}
        {%- endif -%}
          {{ media_element }}
        {%- if
          block.settings.subheading != blank
            or
          block.settings.heading != blank
            or
          block.settings.text != blank
            or
          block.settings.button_label_1 != blank
            or
          block.settings.button_label_2 != blank
        -%}
          {{ content_element }}
        {%- endif -%}

        {%- liquid
          if block.settings.button_link_1 != blank and block.settings.button_link_1_type == 'card'
            echo '<a href="' | append: block.settings.button_link_1 | append: '" class="section-hero__link">&nbsp;</a>'
          endif
        -%}

      </div>

      {%- if section.blocks.size > 1 -%}
        </div>
      {%- endif -%}
    {%- endfor -%}
  {%- endcapture -%}

  <div class="hero-banner {% unless section.blocks.size > 1 -%} color-{{ section.blocks.first.settings.color_scheme }} gradient{%- endunless-%}">
    {%- assign autoplay_interval = section.settings.slideshow_autoplay_interval | times: 1 -%}
    {%- if section.blocks.size > 1 -%}
      <hero-slider
        class="swiper hero__swiper"
        aria-label="{{- 'theme.accessibility.slideshow' | t -}}"
        data-autoplay="{%- if autoplay_interval > 0 -%}true{%- else -%}false{%- endif -%}"
        data-autoplay-interval="{{- autoplay_interval | times: 1000 -}}"
        data-arrows="{{- section.settings.show_slideshow_navigation -}}"
      >
        <div class="swiper-wrapper hero__swiper-wrapper">
          {{ hero_slides }}
        </div>

        {%- if section.settings.show_slideshow_pagination -%}
          <div
            class="swiper-pagination hero__swiper-pagination{% if section.settings.slideshow_pagination_style == 'style-2' and section.settings.floating_bar == false %} hero__swiper-pagination-horizontal{% endif %}"
          ></div>
        {%- endif -%}

        {%- if section.settings.show_slideshow_navigation -%}
          <div class="swiper-buttons hero__swiper-buttons small-hide no-js-hidden {{ section.settings.slideshow_navigation_position }} color-{{ section.settings.color_scheme_arrows }}">
            <button
              class="swiper-button hero__swiper-button swiper-button--prev"
              aria-label="{{- 'theme.actions.previous' | t -}}"
            >
              {%- render 'icon', icon_name: 'theme-chevron', class: 'icon' -%}
            </button>
            <button
              class="swiper-button hero__swiper-button swiper-button--next"
              aria-label="{{- 'theme.actions.next' | t -}}"
            >
              {%- render 'icon', icon_name: 'theme-chevron', class: 'icon' -%}
            </button>
          </div>
        {%- endif -%}
      </hero-slider>
    {%- else -%}
      {{ hero_slides }}
    {%- endif -%}
  </div>
{%- endif -%}

{% schema %}
{
  "name": "t:sections.hero-banner.name",
  "tag": "section",
  "class": "section-hero-banner",
  "settings": [
    {
      "type": "header",
      "content": "t:sections.global.header.slideshow.content"
    },
    {
      "type": "range",
      "id": "slider_height",
      "label": "t:sections.hero-banner.settings.slider_height.label",
      "info": "t:sections.hero-banner.settings.slider_height.info",
      "min": 50,
      "max": 100,
      "step": 5,
      "unit": "%",
      "default": 100
    },
    {
      "type": "range",
      "id": "slideshow_autoplay_interval",
      "min": 0,
      "max": 60,
      "step": 1,
      "unit": "t:sections.hero-banner.settings.slideshow_autoplay_interval.unit",
      "label": "t:sections.hero-banner.settings.slideshow_autoplay_interval.label",
      "info": "t:sections.hero-banner.settings.slideshow_autoplay_interval.info",
      "default": 6
    },
    {
      "type": "checkbox",
      "id": "show_slideshow_navigation",
      "label": "t:sections.hero-banner.settings.show_slideshow_navigation.label",
      "info": "t:sections.hero-banner.settings.show_slideshow_navigation.info",
      "default": true
    },
    {
      "type": "select",
      "id": "slideshow_navigation_position",
      "label": "t:sections.hero-banner.settings.slideshow_navigation_position.label",
      "options": [
        {
          "value": "hero__swiper-buttons--sides",
          "label": "t:sections.hero-banner.settings.slideshow_navigation_position.options.sides.label"
        },
        {
          "value": "hero__swiper-buttons--start",
          "label": "t:sections.hero-banner.settings.slideshow_navigation_position.options.start.label"
        },
        {
          "value": "hero__swiper-buttons--center",
          "label": "t:sections.hero-banner.settings.slideshow_navigation_position.options.center.label"
        }
      ],
      "default": "hero__swiper-buttons--start"
    },
    {
      "type": "color_scheme",
      "id": "color_scheme_arrows",
      "label": "t:sections.global.color_scheme.for__arrows.label",
      "default": "scheme-1"
    },
    {
      "type": "checkbox",
      "id": "show_slideshow_pagination",
      "label": "t:sections.hero-banner.settings.show_slideshow_pagination.label",
      "info": "t:sections.hero-banner.settings.show_slideshow_pagination.info",
      "default": true
    },
    {
      "type": "select",
      "id": "slideshow_pagination_style",
      "label": "t:sections.hero-banner.settings.slideshow_pagination_style.label",
      "options": [
        {
          "value": "style-1",
          "label": "t:sections.hero-banner.settings.slideshow_pagination_style.options__1.label"
        },
        {
          "value": "style-2",
          "label": "t:sections.hero-banner.settings.slideshow_pagination_style.options__2.label"
        }
      ],
      "default": "style-1"
    },
    {
      "type": "checkbox",
      "id": "floating_bar",
      "label": "t:sections.hero-banner.settings.floating_bar.label",
      "info": "t:sections.hero-banner.settings.floating_bar.info",
      "default": false
    }
  ],
  "blocks": [
    {
      "type": "slide",
      "name": "t:sections.hero-banner.blocks.slide.name",
      "settings": [
        {
          "type": "select",
          "id": "banner_layout",
          "label": "t:sections.global.settings.banner_layout.label",
          "options": [
            {
              "value": "hero-banner--full",
              "label": "t:sections.global.settings.banner_layout.options.layout_full.label"
            },
            {
              "value": "hero-banner--70-30",
              "label": "t:sections.global.settings.banner_layout.options.layout_70_30.label"
            },
            {
              "value": "hero-banner--30-70",
              "label": "t:sections.global.settings.banner_layout.options.layout_30_70.label"
            },
            {
              "value": "hero-banner--split",
              "label": "t:sections.global.settings.banner_layout.options.layout_split.label"
            }
          ],
          "default": "hero-banner--full"
        },
        {
          "type": "color_scheme",
          "id": "color_scheme",
          "default": "scheme-1",
          "label": "t:sections.global.color_scheme.label"
        },
        {
          "type": "color",
          "id": "header_menu_text_color",
          "label": "Header menu color",
          "default": "#ffffff"
        },
        {
          "type": "header",
          "content": "t:sections.global.header.content.content"
        },
        {
          "type": "richtext",
          "id": "heading",
          "label": "t:sections.global.element.heading.label",
          "default": "<p>Highlight your promotion</p>"
        },
        {
          "type": "inline_richtext",
          "id": "subheading",
          "label": "t:sections.global.element.subheading.label",
          "default": "Highlight your promotion"
        },
        {
          "type": "url",
          "id": "subheading_link",
          "label": "t:sections.global.element.subheading_link.label"
        },
        {
          "type": "richtext",
          "id": "text",
          "label": "t:sections.global.element.text.label",
          "default": "<p>Highlight your promotion</p>"
        },
        {
          "type": "header",
          "content": "t:sections.global.header.buttons.content"
        },
        {
          "type": "url",
          "id": "button_link_1",
          "label": "t:sections.global.element.button.link.for__button_1.label",
          "default": "/"
        },
        {
          "type": "select",
          "id": "button_link_1_type",
          "label": "t:sections.global.element.link.type.for__full_width_banner.label",
          "options": [
            {
              "value": "button",
              "label": "t:sections.global.element.link.type.options.button.label"
            },
            {
              "value": "card",
              "label": "t:sections.global.element.link.type.options.card.label"
            }
          ],
          "default": "button"
        },
        {
          "type": "text",
          "id": "button_label_1",
          "label": "t:sections.global.element.button_label.for__button_1.label",
          "info": "t:sections.global.element.button_label.info",
          "default": "View more"
        },
        {
          "type": "select",
          "id": "button_style_1",
          "label": "t:sections.global.element.button.style.for__button_1.label",
          "options": [
            {
              "value": "button--filled",
              "label": "t:sections.global.element.button.style.options.filled.label"
            },
            {
              "value": "button--outlined",
              "label": "t:sections.global.element.button.style.options.outlined.label"
            },
            {
              "value": "button--text",
              "label": "t:sections.global.element.button.style.options.text.label"
            }
          ],
          "default": "button--filled"
        },
        {
          "type": "url",
          "id": "button_link_2",
          "label": "t:sections.global.element.button.link.for__button_2.label",
          "default": "/"
        },
        {
          "type": "text",
          "id": "button_label_2",
          "label": "t:sections.global.element.button_label.for__button_2.label",
          "info": "t:sections.global.element.button_label.info",
          "default": "View more"
        },
        {
          "type": "select",
          "id": "button_style_2",
          "label": "t:sections.global.element.button.style.for__button_2.label",
          "options": [
            {
              "value": "button--filled",
              "label": "t:sections.global.element.button.style.options.filled.label"
            },
            {
              "value": "button--outlined",
              "label": "t:sections.global.element.button.style.options.outlined.label"
            },
            {
              "value": "button--text",
              "label": "t:sections.global.element.button.style.options.text.label"
            }
          ],
          "default": "button--outlined"
        },
        {
          "type": "header",
          "content": "t:sections.global.header.desktop.content"
        },
        {
          "type": "select",
          "id": "content_position",
          "label": "t:sections.global.content.position.label",
          "options": [
            {
              "value": "start",
              "label": "t:sections.global.content.position.options.start.label"
            },
            {
              "value": "center",
              "label": "t:sections.global.content.position.options.center.label"
            },
            {
              "value": "end",
              "label": "t:sections.global.content.position.options.end.label"
            }
          ],
          "default": "end"
        },
        {
          "type": "select",
          "id": "content_alignment",
          "label": "t:sections.global.content.alignment.label",
          "options": [
            {
              "value": "start",
              "label": "t:sections.global.content.alignment.options.start.label"
            },
            {
              "value": "center",
              "label": "t:sections.global.content.alignment.options.center.label"
            },
            {
              "value": "end",
              "label": "t:sections.global.content.alignment.options.end.label"
            }
          ],
          "default": "center"
        },
        {
          "type": "image_picker",
          "id": "image",
          "label": "t:sections.hero-banner.blocks.slide.settings.image.label"
        },
        {
  "type": "url",
  "id": "link",
  "label": "Image link",

},
        {
          "type": "video",
          "id": "video",
          "label": "t:sections.hero-banner.blocks.slide.settings.video.label",
          "info": "t:sections.hero-banner.blocks.slide.settings.video.info"
        },
        {
          "type": "video_url",
          "id": "video_external",
          "accept": [
            "youtube",
            "vimeo"
          ],
          "info": "t:sections.hero-banner.blocks.slide.settings.video_external.info",
          "label": "t:sections.hero-banner.blocks.slide.settings.video_external.label"
        },
        {
          "type": "checkbox",
          "id": "show_controls_on_video",
          "label": "t:sections.global.element.video.show_controls.label",
          "default": false
        },
        {
          "type": "checkbox",
          "id": "enable_media_overlay_desktop",
          "label": "t:sections.hero-banner.blocks.slide.settings.enable_media_overlay_desktop.label",
          "default": true
        },
        {
          "type": "header",
          "content": "t:sections.global.header.mobile.content",
          "info": "t:sections.global.header.media_mobile.info"
        },
        {
          "type": "select",
          "id": "content_position_mobile",
          "label": "t:sections.global.content.position.label",
          "options": [
            {
              "value": "start",
              "label": "t:sections.global.content.position.options.start.label"
            },
            {
              "value": "center",
              "label": "t:sections.global.content.position.options.center.label"
            },
            {
              "value": "end",
              "label": "t:sections.global.content.position.options.end.label"
            }
          ],
          "default": "center"
        },
        {
          "type": "select",
          "id": "content_alignment_mobile",
          "label": "t:sections.global.content.alignment.label",
          "options": [
            {
              "value": "start",
              "label": "t:sections.global.content.alignment.options.start.label"
            },
            {
              "value": "center",
              "label": "t:sections.global.content.alignment.options.center.label"
            },
            {
              "value": "end",
              "label": "t:sections.global.content.alignment.options.end.label"
            }
          ],
          "default": "center"
        },
        {
          "type": "image_picker",
          "id": "image_mobile",
          "label": "t:sections.hero-banner.blocks.slide.settings.image_mobile.label"
        },
        {
          "type": "video",
          "id": "video_mobile",
          "label": "t:sections.hero-banner.blocks.slide.settings.video_mobile.label",
          "info": "t:sections.hero-banner.blocks.slide.settings.video_mobile.info"
        },
        {
          "type": "video_url",
          "id": "video_external_mobile",
          "accept": [
            "youtube",
            "vimeo"
          ],
          "label": "t:sections.hero-banner.blocks.slide.settings.video_external_mobile.label",
          "info": "t:sections.hero-banner.blocks.slide.settings.video_external_mobile.info"
        },
        {
          "type": "checkbox",
          "id": "show_controls_on_video_mobile",
          "label": "t:sections.global.element.video.for__mobile.show_controls.label",
          "default": false
        },
        {
          "type": "checkbox",
          "id": "enable_media_overlay_mobile",
          "label": "t:sections.hero-banner.blocks.slide.settings.enable_media_overlay_mobile.label",
          "default": true
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "t:sections.hero-banner.name"
    }
  ]
}
{% endschema %}


#CSSSSS

.hero-banner {
  position: relative;
  overflow: hidden;
  display: flex;
  /* height: var(--inner-height, 100vh); */
  /* max-height: 100svh; */
}
.hero-banner .media {
  border-radius: 0;
}

/* html.js .hero__swiper .hero__content {
  transform: translateY(30%);
  transition: transform 600ms;
} */

html.js .hero__swiper-slide.swiper-slide-active .hero__content {
  transform: translateY(0);
}

.hero__swiper {
  flex: 1;
}

html.no-js .hero__swiper-wrapper {
  display: block;
  height: auto;
}

.hero__swiper-slide {
  display: flex;
  flex: 0 0 100%;
  max-width: 100%;
}

html.no-js .hero__swiper-slide {
  height: auto;
}

.hero__inner {
  display: grid;
  grid-template-rows: 1fr;

  --inner-vertical-padding: 4rem;

  color: rgb(var(--color-foreground));
  width: 100%;
  position: relative;
  z-index: 3;

  background-color: rgb(var(--color-background));
}

.hero__content {
  position: relative;
  width: 100%; height: 100%;
  padding: 3.6rem calc(var(--page-gutter) * 1.5);
  color: rgb(var(--color-foreground));
  display: flex;
  flex-direction: column;
  z-index: 2;
  background-color: rgb(var(--color-background));
  pointer-events: none;
}
.hero__content a {
  pointer-events: auto;
}
.hero-banner--full .hero__content {
  flex: 1;
  background-color: transparent;
}
.hero-banner--split .hero__content {
  flex: 1;
  max-width: 55rem;
  margin-inline: auto;
  background-color: rgb(var(--color-background));
}
.hero-banner--full .hero__content > :first-child,
.hero-banner--split .hero__content > :first-child {
  margin-block-start: 0;
}

.hero__media {
  width: 100%; height: 100%;
}

.hero-banner--full .hero__media {
  /* position: absolute; */
  inset-block: 0;
  inset-inline: 0;
  width: 100%;
  /* height: 100%; */
  background-color: transparent;
}

.hero-banner--split .hero__media {
  padding: 0;
  height: 100%;
  background-color: rgb(var(--color-background));
}

.hero-banner--full .hero__media svg,
.hero-banner--split .hero__media svg,
.hero__media svg {
  opacity: 0.5;
}

.hero-banner--full .hero__media iframe,
.hero-banner--full .hero__media video,
.hero__media iframe,
.hero__media video {
  border: none;
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
}
[dir='rtl'] .hero-banner--full .hero__media iframe,
[dir='rtl'] .hero-banner--full .hero__media video,
[dir='rtl'] .hero__media iframe,
[dir='rtl'] .hero__media video {
  transform: translate(50%, -50%);
}

.hero-banner--full .hero__media--desktop iframe,
.hero-banner--full .hero__media--desktop video,
.hero__media--desktop iframe,
.hero__media--desktop video {
  width: 296%;
  max-width: 296%;
}



.hero__subheading {
  color: rgb(var(--color-heading-text));
  font-size: var(--font-size-static-sm);
  line-height: var(--line-height-static-sm);
  letter-spacing: var(--letter-spacing-medium);
  font-weight: var(--font-weight-normal);
  text-transform: uppercase;
  margin-block-end: 2rem;
}

.hero-banner .hero__heading {
  color: rgb(var(--color-heading-text));
  margin-block-end: 1.6rem;
  padding-block: 0;
}

.hero__heading p {
  margin-block: 0;
}

.hero__button {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  gap: var(--spacing-2);
}

.hero__entry {
  margin-block-end: 2.4rem;
}
.hero__entry p {
  margin-block-start: 0;
}

.hero__swiper:has(.swiper-pagination-horizontal) .hero__content {
  padding-inline: var(--spacing-7);
}

.hero__swiper:has(.hero__swiper-pagination-horizontal) .hero__content {
  padding-block: 7.2rem;
}


.swiper-horizontal>.swiper-pagination-bullets.hero__swiper-pagination:not(.hero__swiper-pagination-horizontal),
.swiper-pagination-bullets.swiper-pagination-horizontal.hero__swiper-pagination:not(.hero__swiper-pagination-horizontal),
.swiper-pagination-custom.hero__swiper-pagination:not(.hero__swiper-pagination-horizontal),
.swiper-pagination-fraction.hero__swiper-pagination:not(.hero__swiper-pagination-horizontal) {
  width: unset;
  inset-block-end: 2.8rem;
  inset-inline-start: unset;
  inset-inline-end: 2.4rem;
}

.swiper-horizontal>.swiper-pagination-bullets.hero__swiper-pagination.hero__swiper-pagination-horizontal,
.swiper-pagination-bullets.swiper-pagination-horizontal.hero__swiper-pagination.hero__swiper-pagination-horizontal,
.swiper-pagination-custom.hero__swiper-pagination.hero__swiper-pagination-horizontal,
.swiper-pagination-fraction.hero__swiper-pagination.hero__swiper-pagination-horizontal {
  width: unset;
  inset-block-end: 2.8rem;
  inset-inline-start: 50%;
  inset-inline-end: unset;
  transform: translate(-50%, 0);
}
[dir='rtl'] .swiper-horizontal>.swiper-pagination-bullets.hero__swiper-pagination.hero__swiper-pagination-horizontal,
[dir='rtl'] .swiper-pagination-bullets.swiper-pagination-horizontal.hero__swiper-pagination.hero__swiper-pagination-horizontal,
[dir='rtl'] .swiper-pagination-custom.hero__swiper-pagination.hero__swiper-pagination-horizontal,
[dir='rtl'] .swiper-pagination-fraction.hero__swiper-pagination.hero__swiper-pagination-horizontal {
  transform: translate(50%, 0);
}

@media screen and (min-width: 990px) {
  .swiper-horizontal>.swiper-pagination-bullets.hero__swiper-pagination:not(.hero__swiper-pagination-horizontal),
  .swiper-pagination-bullets.swiper-pagination-horizontal.hero__swiper-pagination:not(.hero__swiper-pagination-horizontal),
  .swiper-pagination-custom.hero__swiper-pagination:not(.hero__swiper-pagination-horizontal),
  .swiper-pagination-fraction.hero__swiper-pagination:not(.hero__swiper-pagination-horizontal) {
    width: unset;
    inset-block-end: 2.4rem;
    inset-inline-start: unset;
    inset-inline-end: var(--page-gutter);
  }
  .swiper-horizontal>.swiper-pagination-bullets.hero__swiper-pagination.hero__swiper-pagination-horizontal,
  .swiper-pagination-bullets.swiper-pagination-horizontal.hero__swiper-pagination.hero__swiper-pagination-horizontal,
  .swiper-pagination-custom.hero__swiper-pagination.hero__swiper-pagination-horizontal,
  .swiper-pagination-fraction.hero__swiper-pagination.hero__swiper-pagination-horizontal {
    width: unset;
    inset-block-end: 4.6rem;
    inset-inline-start: unset;
    inset-inline-end: var(--spacing-7);
    transform: unset;
  }
  .hero__subheading {
    margin-block-end: 2.8rem;
  }
  .hero-banner .hero__heading {
    margin-block-end: 2rem;
  }
}

.hero__swiper-pagination .swiper-pagination-bullet {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  height: auto;
  margin: 0 10px;
  background-color: transparent;
  border-radius: 0.5rem;
  border: 0.2rem solid rgba(255, 255, 255, 0);
  cursor: pointer;
  transition: 0.3s;
}

.hero__swiper-pagination .swiper-pagination-bullet span {
  color: rgb(var(--color-white-rgb));
  font-size: var(--font-size-static-sm);
  font-weight: var(--font-body-weight);
  font-family: var(--font-body-family);
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  visibility: hidden;
  letter-spacing: 0.2rem;
}
[dir='rtl'] .hero__swiper-pagination .swiper-pagination-bullet span {
  transform: translate(50%, -50%);
}

.progress {
  transform: rotate(-90deg);
}

.square-origin {
  border-radius: 0.5rem !important;
  fill: transparent;
  stroke: rgb(255, 255, 255);
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-dasharray: 155px;
  stroke-dashoffset: 155px;
}

.circle-origin {
  fill: transparent;
  stroke: rgb(255, 255, 255);
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-dasharray: 56.5487px;
  stroke-dashoffset: 56.5487px;
}

.hero__swiper-pagination:not(.hero__swiper-pagination-horizontal) .swiper-pagination-bullet-active {
  border-color: rgba(255, 255, 255, 0.15);
}

.hero__swiper-pagination:not(.hero__swiper-pagination-horizontal) .swiper-pagination-bullet::before {
  content: '';
  position: absolute;
  width: 0.4rem;
  height: 0.4rem;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  transform: translate(-50%, -50%);
  background: rgb(var(--color-white-rgb));
  border-radius: 0.1rem;
}
[dir='rtl'] .hero__swiper-pagination:not(.hero__swiper-pagination-horizontal) .swiper-pagination-bullet::before {
  transform: translate(50%, -50%);
}

.hero__swiper-pagination .swiper-pagination-bullet-active .square-origin {
  animation: square-progress var(--slideshow-pagination-progress-time);
}

.hero__swiper-pagination-horizontal {
  display: flex;
  align-items: center;
}

.hero__swiper-pagination-horizontal .swiper-pagination-bullet-active .circle-origin {
  animation: circle-progress var(--slideshow-pagination-progress-time);
}

.progress {
  display: none;
}

.hero__swiper-pagination-horizontal .progress {
  display: block;
  position: absolute;
  inset-inline-start: -3.4rem;
}

.hero__swiper-pagination-horizontal::before {
  content: '';
  width: 1.8rem;
  height: 1.8rem;
  inset-block-start: 50%;
  inset-inline-start: -1.6rem;
  transform: translate(0, -50%);
  position: absolute;
  border: 0.1rem solid rgba(var(--color-white-rgb), 0.2);
  border-radius: 100%;
}

.hero__swiper-pagination-horizontal::after {
  content: '';
  width: 0.3rem;
  height: 0.3rem;
  inset-block-start: 0;
  inset-inline-start: -0.84rem;
  position: absolute;
  background: #fff;
  border-radius: 100%;
}

.hero__swiper-pagination-horizontal .swiper-pagination-bullet {
  margin-inline-start: 1.6rem !important;
}

.hero__swiper-pagination-horizontal .square-progress {
  display: none;
}

.hero__swiper-pagination-horizontal .swiper-pagination-bullet span {
  opacity: 1;
  visibility: visible;
}

.hero__swiper-buttons {
  display: none;
  background: transparent;
}

.hero__swiper-buttons .swiper-button {
  width: 2.4rem;
  height: 2.4rem;
}

.hero__swiper-buttons .swiper-button--prev {
  margin-inline-end: 1.6rem;
}

.section-hero__link {
  width: 0; height: 0;
  overflow: hidden;
}
.section-hero__link::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
}
@media (hover: hover) {
  .hero__inner:has(.section-hero__link):hover .section-hero__button {
    color: var(--color-button-hover-text);
    background-color: var(--color-button-hover-background);
    border-color: var(--color-button-hover-outline);
  }
}

@media screen and (max-width: 749px) {
  .hero__inner {
    text-align: center;
    align-items: flex-end;
    justify-content: center;
  
  }
}

@media screen and (min-width: 750px) {
  .hero__inner {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: unset;
    column-gap: 0;
    grid-template-areas: "media_element";
  }
  .hero__inner.hero-banner--full {
    display: flex;
  }
  .hero__inner.hero-banner--split {
    display: flex;
    margin-inline: auto;
  }
  .hero-banner--70-30 {
    grid-template-columns: 50% 50%;
    grid-template-areas: "media_element content_element";
  }
  .hero-banner--30-70 {
    grid-template-columns: 50% 50%;
    grid-template-areas: "content_element media_element";
  }
  .hero-banner .hero__heading {
    font-size: calc(var(--font-heading-scale) * var(--h3-multiplier))
  }
  .hero-banner .hero__heading em {
    font-size: calc(var(--font-italic-scale) * var(--h3-multiplier))
  }

  .hero__media + .hero__content {
    margin-block-start: 0;
  }

  .hero__media {
    grid-area: media_element;
    position: relative;
    z-index: 1;
  }
  .hero__content {
    grid-area: content_element;
    position: relative;
    z-index: 2;
  }

  .hero-banner--split .hero__media {
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    width: 100%; height: 100%;
  }

  .hero-banner--full .hero__media video,
  .hero-banner--split .hero__media video {
    width: 100%;
    height: 100%;
  }

  .hero__swiper-buttons {
    display: flex;
    padding: 0 var(--page-gutter);
    justify-content: space-between;
  }

  .hero__swiper-buttons:not(.hero__swiper-buttons--sides) {
    inset-block-start: unset;
    inset-block-end: var(--page-gutter);
    transform: none;
    align-items: flex-end;
  }

  .hero__swiper-buttons--start {
    justify-content: flex-start;
  }
  .hero__swiper-buttons--center {
    justify-content: center;
  }
  .hero__swiper-buttons--end {
    justify-content: flex-end;
  }

  .hero__media--desktop iframe,
  .hero__media--desktop video {
    width: 114%;
    max-width: 114%;
    height: 108%;
  }

  .hero__inner {
    --inner-vertical-padding: 9.6rem;
  }

  .hero__inner.justify-center {
    --inner-vertical-padding: 13rem;
  }
}



@media screen and (min-width: 990px) {

  .hero-banner--70-30 {
    grid-template-columns: 60% 40%;
    grid-template-areas: "media_element content_element";
  }

  .hero-banner--30-70 {
    grid-template-columns: 40% 60%;
    grid-template-areas: "content_element media_element";
  }

  .hero-banner .hero__heading {
    font-size: calc(var(--font-heading-scale) * var(--h2-multiplier))
  }

  .hero-banner .hero__heading em {
    font-size: calc(var(--font-italic-scale) * var(--h2-multiplier))
  }

  .hero__swiper-buttons:not(.hero__swiper-buttons--sides) {
    display: flex;
    inset-block-start: unset;
    inset-block-end: 3.6rem;
    transform: none;
    align-items: flex-end;
  }

  .hero__swiper-buttons {
    padding: 0 calc(var(--page-gutter) - 0.4rem);
  }
}

@media screen and (min-width: 1440px) {

  .hero-banner--70-30 {
    grid-template-columns: 70% 30%;
    grid-template-areas: "media_element content_element";
  }

  .hero-banner--30-70 {
    grid-template-columns: 30% 70%;
    grid-template-areas: "content_element media_element";
  }

  .hero-banner .hero__heading {
    font-size: calc(var(--font-heading-scale) * var(--h1-multiplier))
  }

  .hero-banner .hero__heading em {
    font-size: calc(var(--font-italic-scale) * var(--h1-multiplier))
  }

}

/* animations */
@keyframes square-progress {
  0% {
    stroke-dashoffset: 155px;
  }

  90% {
    stroke-dashoffset: 0;
  }

  100% {
    stroke-dashoffset: -155px;
  }
}

@keyframes circle-progress {
  0% {
    stroke-dashoffset: 56.5487px;
  }

  90% {
    stroke-dashoffset: 0;
  }

  100% {
    stroke-dashoffset: -56.5487px;
  }
}

/*  */

/* Adjust hero content width inside the first slide */
.swiper-slide[data-index="0"] .hero__content {
  width: 30%; /* Adjust as needed */
  max-width: 800px; /* Set a max-width for better control */
  margin-left: 0px; /* Align to the left */
}
.swiper-slide[data-index="2"] .hero__content {
  width: 30%; /* Adjust as needed */
  max-width: 900px; /* Set a max-width for better control */
  margin-left: 35px; /* Align to the left */
}
/* Adjust hero content width and align it to the right inside the second slide */
.swiper-slide[data-index="1"] .hero__content {
  width: 40%; /* Adjust width as needed */
  max-width: 1000px; /* Prevents it from being too wide */
  margin-left: auto; /* Moves content to the right */
  margin-right: 0;
  text-align: right; /* Ensures text is aligned to the right */
  /* justify-content: flex-end; */
  /* align-items: flex-end; */
  display: flex;
  flex-direction: column;
}
/* Adjust hero__entry in the second slide */
.swiper-slide[data-index="0"] .hero__entry.entry.entry--list-padding-none h5 {
  color: #3F3F3F; !important/* Change text color */
  padding-left: 30px; /* Add left padding */
  margin-top: 15px; /* Add space above */
}
/* Adjust hero__entry in the second slide */
.swiper-slide[data-index="2"] .hero__entry.entry.entry--list-padding-none h5 {
  color: #3F3F3F; !important/* Change text color */
  padding-left: 20px; /* Add left padding */
  margin-top: 15px; /* Add space above */
}
.swiper-slide[data-index="1"] .hero__entry.entry.entry--list-padding-none h5 {
 
   /* Add left padding */
  margin-top: 15px; /* Add space above */
}
.hero__button a{
  font-size: 2rem !important;
}
@media (max-width: 768px) {
  .hero__inner.hero-banner--full.small-up-hide-media-overlay {
    max-width: 100% !important;
    width: 100% !important;
  }
  .swiper-slide[data-index="0"] .hero__content {
    width: 100%;
    margin-left: 0;
  }
  .swiper-slide[data-index="2"] .hero__content {
    width: 100%;
    margin-left: 0;
  }
  .swiper-slide[data-index="1"] .hero__content {
    width: 100%;
    margin-right: auto;
    margin-left: 0;
    text-align: left;
    display: flex;
    flex-direction: column;
  }
  .hero__button a {
    font-size: 1rem !important;
  }
}

#jss

if(!customElements.get('hero-slider')) {
  class HeroSlider extends HTMLElement {
    constructor() {
      super();

      if (Shopify.designMode) {
        window.addEventListener('shopify:section:load', e => {
          this.mountSlider();
        });
      }

      this.mountSlider();

      window.addEventListener('shopify:block:select', e => {
        const selectedSlideIndex = +e.target.dataset.index;
        this.slider.slideTo(selectedSlideIndex, 600);
      });
    }

    mountSlider() {
      const autoplayOptions = {
        delay: this.dataset.autoplayInterval
      };

      this.slider = new Swiper(this, {
        effect: 'fade',
        rewind: true,
        slidesPerView: 1,
        speed: 600,
        followFinger: false,
        navigation: {
          nextEl: '.swiper-button--next',
          prevEl: '.swiper-button--prev'
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          renderBullet: function (i, className) {
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
        autoplay:
          this.dataset.autoplay === 'true' ? autoplayOptions : false,
        on: {
          init: this.handleSlideChange.bind(this),
          slideChange: this.handleSlideChange.bind(this)
        }
      });
    }

    handleSlideChange(swiper) {
      let headerInner = document.querySelector('.header__inner');
      let heroInners = document.querySelectorAll('.hero__inner');

      if (!headerInner || !heroInners) {
        return;
      }

      // change --transparent-header-menu-text-color value on document style attributes
      document.documentElement.style.setProperty(
        '--transparent-header-menu-text-color',
        heroInners[swiper.activeIndex].dataset.headerMenuTextColor
      );
    }
  }
  customElements.define('hero-slider', HeroSlider);
}
