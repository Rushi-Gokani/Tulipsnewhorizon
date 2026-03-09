# Shopify Theme Check Fix Report

Date: 2026-03-09

## Scope

- Applied a safe fix pass focused on **blocking errors** and **performance-safe lint fixes**.
- Kept visual structure/styles intact and avoided intentional design changes.
- Added only code/schema/lint compliance updates.

## Validation Commands

- `shopify theme check -o json --fail-level info`
- `shopify theme check -C theme-check:all -o json --fail-level info`

## Result Summary

### Default config (`shopify theme check`)

- Before: **113** offenses (**46 errors**, **67 warnings**)
- After: **40** offenses (**0 errors**, **40 warnings**)
- Net reduction: **-73 offenses**, **all blocking errors cleared**

### Strict/all checks (`theme-check:all`)

- Before: **26,421** offenses total
- After: **26,832** offenses total
  - Note: this mode includes `MatchingTranslations` across locale files and is intentionally very strict.
- Actionable subset (excluding `MatchingTranslations`):
  - Before: **135** (**68 errors**, **67 warnings**)
  - After: **66** (**26 errors**, **40 warnings**)

## What Was Fixed

### Critical blockers resolved

- `config/settings_schema.json`: added missing select `label` for `envType`.
- `sections/header.liquid`: resolved duplicate static block ids by using unique ids for menu variants.
- `sections/image-slider.liquid`: fixed invalid unknown filter usage (`append_link_1`) by replacing with valid append flow.
- `blocks/_featured-blog-posts-card.liquid`: added missing static block target render (`blog-post-description`) to fix preset block target validation.
- `assets/component-product-badges.css`: added missing asset file referenced by `snippets/product-badges.liquid`.
- `locales/en.default.json`: added missing translation keys used by sections/snippets.

### Accessibility and layout-shift fixes

- Added missing `width`/`height` to flagged `img` tags in:
  - `sections/accordion-with-icons.liquid`
  - `sections/banner-below-img.liquid`
  - `sections/certificates-collections.liquid`
  - `sections/cotton-quality-section.liquid`
  - `sections/custom-newletterform.liquid`
  - `sections/simple-product-card.liquid`
  - `sections/tulips-section-1.liquid`
  - `snippets/gokwik-checkout.liquid`

### Deprecation/compatibility fixes

- Replaced deprecated `img_url` with `image_url` where flagged.
- Updated hardcoded cart routes to `{{ routes.cart_add_url }}` in:
  - `blocks/product-card-button.liquid`
  - `snippets/product-card-button.liquid`

### Parser-blocking script fixes

- Added `defer` to external Swiper scripts in:
  - `sections/featured-collection-carousel.liquid`
  - `sections/happy-customers.liquid`
  - `sections/image-slider.liquid`
  - `sections/testimonials.liquid`

### Markup/schema lint cleanup

- `sections/brandabout.liquid`: fixed unclosed/conditionally-mismatched list markup by splitting into two explicit `<ul>` loops.
- `blocks/_blog-post-info-text.liquid`: used assigned `display_author` properly.
- `sections/custom-newletterform.liquid`: migrated to Shopify `{% form 'customer' %}` usage to fix undefined form object warning.
- `sections/page-banner.liquid`, `snippets/card-product.liquid`, `snippets/product-card.liquid`, `snippets/product-groups.liquid`, `snippets/video.liquid`: removed unused assignments/doc params flagged by theme check.

### Upload error hotfix

- `blocks/_product-details.liquid`: corrected preset text values to valid rich text nodes (`<p>...</p>`) to resolve:
  - `Invalid preset ... Setting 'text' is invalid. All top level nodes must be '<p>', '<ul>', '<ol>' or '<h1>'-'<h6>' tags`

## Remaining Issues (Intentional / High-risk to auto-fix)

### In default config (warnings only)

- `RemoteAsset` (21): third-party/CDN assets and external resources.
- `UndefinedObject` (16): snippet context assumptions requiring broader refactor/testing.
- `BlockIdUsage` (3): dynamic block id usage in `sections/featured-products.liquid`.

### In strict/all config (errors still present)

- `AssetSizeJavaScript` (25)
- `AssetSizeCSS` (1)

These are optimization-architecture items (code-splitting/import-on-interaction and CSS splitting) and were not auto-refactored to avoid unintended behavior/design impact in this pass.

## Files Updated

- `assets/component-product-badges.css`
- `blocks/_blog-post-info-text.liquid`
- `blocks/_featured-blog-posts-card.liquid`
- `blocks/_product-details.liquid`
- `blocks/product-card-button.liquid`
- `config/settings_schema.json`
- `locales/en.default.json`
- `sections/accordion-with-icons.liquid`
- `sections/banner-below-img.liquid`
- `sections/brandabout.liquid`
- `sections/certificates-collections.liquid`
- `sections/cotton-quality-section.liquid`
- `sections/custom-newletterform.liquid`
- `sections/featured-collection-carousel.liquid`
- `sections/happy-customers.liquid`
- `sections/header.liquid`
- `sections/hero-banner.liquid`
- `sections/image-slider.liquid`
- `sections/page-banner.liquid`
- `sections/simple-product-card.liquid`
- `sections/testimonials.liquid`
- `sections/tulips-section-1.liquid`
- `snippets/card-product.liquid`
- `snippets/gokwik-checkout.liquid`
- `snippets/product-card-button.liquid`
- `snippets/product-card.liquid`
- `snippets/product-groups.liquid`
- `snippets/video.liquid`
