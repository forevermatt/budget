---
name: Soft Sky Budgeting
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#40484e'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#6e7980'
  outline-variant: '#bfc8ce'
  surface-tint: '#00668a'
  primary: '#004d69'
  on-primary: '#ffffff'
  primary-container: '#00668a'
  on-primary-container: '#004965'
  inverse-primary: '#87cff8'
  secondary: '#006399'
  on-secondary: '#ffffff'
  secondary-container: '#7ec2fd'
  on-secondary-container: '#004f7b'
  tertiary: '#3c475a'
  on-tertiary: '#ffffff'
  tertiary-container: '#545f73'
  on-tertiary-container: '#ced9f1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c3e8ff'
  primary-fixed-dim: '#87cff8'
  on-primary-fixed: '#001e2c'
  on-primary-fixed-variant: '#004c68'
  secondary-fixed: '#cde5ff'
  secondary-fixed-dim: '#95ccff'
  on-secondary-fixed: '#001d32'
  on-secondary-fixed-variant: '#004a75'
  tertiary-fixed: '#d8e3fb'
  tertiary-fixed-dim: '#bcc7de'
  on-tertiary-fixed: '#111c2d'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  sky-accent: '#38bdf8'
  on-pace-fill: '#cce2df'
  behind-pace-fill: '#fbe4c6'
  overspend-fill: '#ffb4ab'
  pace-line: 'rgba(25, 28, 30, 0.5)'
  action-shadow: 'rgba(0, 77, 105, 0.3)'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  margin-mobile: 20px
  gutter: 16px
---

## Brand & Style
The design system is centered on the metaphor of **Freedom through Organization**. It aims to dismantle financial anxiety, replacing it with a sense of airy lightness and clarity.

### Brand Personality
- **Aspirational & Light:** Evokes a sense of limitless potential through generous whitespace and atmospheric tones.
- **Trustworthy & Solid:** Uses deep primary tones to provide grounding and gravity necessary for a financial tool.
- **Accessible & Human:** Features organic, highly rounded shapes that avoid the cold rigidity of traditional banking.

### Design Style: Modern Minimalism with Soft Elevation
This system utilizes a **Minimalist** approach with subtle **Glassmorphism**. It relies on high-contrast typography for readability and organic "envelope" containers to represent the budgeting methodology. The visual mood is calm, professional, yet optimistic.

## Colors
The palette is dominated by the **Soft Sky** spectrum. 

- **Primary Brand Moment:** Use the primary sky blue for headers and key action moments. 
- **Deep Tones:** Reserved for primary text and high-contrast UI elements to ensure WCAG AA/AAA compliance against light backgrounds.
- **Functional Colors:** Success (derived from emerald), Warning, and Danger are used for progress bars and balance alerts. They are slightly desaturated to maintain the "Soft" aesthetic.
- **Surface Tiers:** Backgrounds use a very cool neutral to keep the interface feeling fresh. Use the `surface-container` variants to create subtle depth without relying solely on shadows.

### Envelope state fills
An envelope row is its own progress bar: the row track is `surface-container-low`, and a fill grows from the left showing what is left to spend. These three fills carry that meaning and are used nowhere else.

- `on-pace-fill` (**#cce2df**) — a 78% white wash of the emerald success tone `#177d6e`. The envelope is either untouched or spending slower than the month is passing.
- `behind-pace-fill` (**#fbe4c6**) — spent share is ahead of the month's elapsed share. The amount stays `on-surface`; the fill alone carries the warning.
- `overspend-fill` (**#ffb4ab**) — grows inward from the *right* edge, proportional to the overspend, paired with an `on-error-container` negative amount.
- An exactly-spent envelope shows the bare track with no fill, so grey means empty rather than broken.

### Functional accents
- `pace-line` (**#191c1e at 50%**) — the 2px vertical line drawn once behind the envelope list at the month's elapsed position. Fill short of the line is behind pace. It sits under the rows and insets 8px from the first and last, so it scales with any number of envelopes.
- `action-shadow` (**#004d69 at 30%**) — the soft drop shadow under the docked primary action button, lifting it off the navigation bar.

## Typography
The design system uses **Plus Jakarta Sans** for its modern, friendly, and highly legible characteristics. 

- **Headlines:** Use Bold weights with slight negative letter-spacing to create an authoritative feel for financial totals.
- **Numbers:** Tabular lining (tnum) must be used for currency displays to ensure vertical alignment in transaction lists and budget envelopes.
- **Accessibility:** Minimum body text size is 16px to ensure readability on mobile devices.
- **Contrast:** Ensure high contrast for all labels; use the `on-surface-variant` for secondary labels and metadata.

## Layout & Spacing
This system uses a **Fluid Grid** with fixed safe margins for mobile and tablet views.

- **Generous Whitespace:** Space is used as a separator rather than lines whenever possible to reduce visual clutter.
- **8px Grid System:** All spacing and component heights scale in increments of 8px.
- **Breakpoints:** 
  - **Mobile:** Single column. Full-width cards.
  - **Tablet (768px+):** 2-column grid for budget envelopes.
  - **Desktop (1200px+):** Fixed center container (max-width 1140px) with dedicated sidebars for transaction entry and filtering.

## Elevation & Depth
Hierarchy is established through **Tonal Layering** and **Soft Ambient Shadows**.

- **Level 0 (Base):** Standard background surfaces.
- **Level 1 (Cards):** White surfaces with a subtle 1px border (`#e2e8f0`) and a very soft, diffused shadow (Blur 20px, 4% Opacity).
- **Level 2 (Floating):** Reserved for the FAB or active Modals. Shadows are more pronounced (Blur 30px, 12% Opacity).
- **Glassmorphism:** Navigation bars and header elements use a `backdrop-filter: blur(12px)` with a semi-transparent white overlay to maintain the "Sky" theme.

## Shapes
The shape language is **Mostly Rounded**, providing a friendly and modern aesthetic that stops short of being fully organic/pill-shaped for structural elements.

- **Buttons & Inputs:** Use a significant radius (12px - 16px) to appear approachable but professional.
- **Containers:** Primary cards and dashboard summaries use a 24px (1.5rem) radius to define clear, soft boundaries.
- **Dynamic Elements:** Progress bars and slider tracks should maintain fully rounded (pill) ends to represent fluid movement.

## Components

### Envelopes (Budget Cards)
The central component.
- **Styling:** Significant corner radius (rounded-xl) with a soft sky-blue border.
- **Visuals:** Progress bars change color based on budget health (Success < 80%, Warning 80-99%, Danger > 100%).

### Action Buttons
- **Primary:** High-saturation background with white text. Corners are highly rounded (12px+) but not full pills.
- **Secondary:** Outlined style with a focus on clear, legible typography.
- **FAB:** A circular or highly rounded square button positioned for thumb-reach on mobile.

### Input Fields
Large touch targets (min-height 48px). Borders use a soft neutral, turning to the primary sky color on focus. Corner radius should match buttons for a cohesive input experience.

### Navigation
A bottom navigation bar with `backdrop-filter: blur`. Active states use the primary color and a subtle indicator.