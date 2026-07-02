---
name: Elite Pitch
colors:
  surface: '#111317'
  surface-dim: '#111317'
  surface-bright: '#37393e'
  surface-container-lowest: '#0c0e12'
  surface-container-low: '#1a1c20'
  surface-container: '#1e2024'
  surface-container-high: '#282a2e'
  surface-container-highest: '#333539'
  on-surface: '#e2e2e8'
  on-surface-variant: '#baccb0'
  inverse-surface: '#e2e2e8'
  inverse-on-surface: '#2f3035'
  outline: '#85967c'
  outline-variant: '#3c4b35'
  surface-tint: '#2ae500'
  primary: '#efffe3'
  on-primary: '#053900'
  primary-container: '#39ff14'
  on-primary-container: '#107100'
  inverse-primary: '#106e00'
  secondary: '#adc6ff'
  on-secondary: '#002e69'
  secondary-container: '#006be2'
  on-secondary-container: '#f2f4ff'
  tertiary: '#fff9f4'
  on-tertiary: '#412d00'
  tertiary-container: '#ffd890'
  on-tertiary-container: '#7e5b00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#79ff5b'
  primary-fixed-dim: '#2ae500'
  on-primary-fixed: '#022100'
  on-primary-fixed-variant: '#095300'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a41'
  on-secondary-fixed-variant: '#004494'
  tertiary-fixed: '#ffdea4'
  tertiary-fixed-dim: '#febb02'
  on-tertiary-fixed: '#261900'
  on-tertiary-fixed-variant: '#5d4200'
  background: '#111317'
  on-background: '#e2e2e8'
  surface-variant: '#333539'
  surface-elevated: '#1A1D23'
  surface-overlay: '#262A33'
  text-primary: '#FFFFFF'
  text-secondary: '#94A3B8'
  border-subtle: '#2D333D'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  button-text:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  search-bar-height: 64px
---

## Brand & Style
The design system is crafted for a premium, high-performance athletic booking experience. It bridges the gap between high-end SaaS utility and the visceral energy of a floodlit football stadium. The brand personality is professional, efficient, and authoritative, targeting both casual players and semi-professional teams who demand a seamless, "pro-tier" experience.

The visual style is **Modern Corporate with high-contrast accents**, utilizing a "Deep Dark" philosophy. It leverages heavy whitespace (via generous padding), high-quality typography, and a refined dark aesthetic that emphasizes clarity and speed. The interface should feel like a high-end dashboard, using subtle depth to organize complex scheduling data.

## Colors
The palette is rooted in a "Pitch at Night" concept. The primary background is a near-black Deep Dark (`#0F1115`), providing a canvas where the **Electric Green** (`#39FF14`) accent can vibrate with maximum visibility. This green is used strictly for primary actions, success states, and key brand highlights.

Secondary blues are borrowed from established booking patterns to evoke trust and reliability in the transaction process. Surface colors use a Slate-shifted Dark Gray to create hierarchical separation without relying on pure black, ensuring the UI remains readable and sophisticated. Text hierarchy is maintained through high-contrast White for headings and a desaturated Soft Gray for metadata and body copy.

## Typography
This design system utilizes a trio of typefaces to define its professional SaaS character. **Hanken Grotesk** serves as the primary headline face, offering a sharp, contemporary geometric feel that suggests precision. **Inter** is used for all body and UI text due to its exceptional legibility in dark mode and its neutral, systematic nature.

For technical details—such as pitch dimensions, availability timestamps, and price breakdowns—**JetBrains Mono** is used in a small-scale, all-caps format to provide a "pro-data" aesthetic. Line heights are generous to prevent text from feeling cramped against the dark background.

## Layout & Spacing
The layout follows a **Fixed Grid** model on desktop (12 columns) and a **Fluid** model on mobile (4 columns). The system relies on a consistent 8px base unit. 

A hallmark of this design system is the "Airbnb-style" floating search bar, which sits at a fixed height of 64px and uses internal dividers rather than gaps to group inputs (Location, Date, Pitch Type). Content cards are arranged in a responsive grid with 24px gutters, ensuring that high-resolution imagery of the football fields remains the focal point. Admin views utilize a pinned sidebar (280px) and a fluid content area for data-heavy scheduling tables.

## Elevation & Depth
Depth is conveyed through **Tonal Layering** and **Low-Contrast Outlines**. Instead of traditional shadows which can get lost in deep dark themes, the design system uses surface color stepping:
- **Level 0 (Background):** Purest dark `#0F1115`.
- **Level 1 (Cards/Sidebar):** `#1A1D23`.
- **Level 2 (Modals/Popovers):** `#262A33`.

Surfaces are further defined by a 1px "Ghost Border" (`#2D333D`). For high-priority elements like the active search state or "Book Now" buttons, a soft, green glow (outer shadow with 15% opacity of the primary green) is used to simulate the intensity of stadium floodlights.

## Shapes
The shape language is "Refined Rounded." Components like buttons and input fields use a 0.5rem (8px) radius to feel modern but structured. Large cards and the main search container use 1rem (16px) to soften the overall appearance of the page. 

Interactive indicators (like "Live" status or "Available" dots) should use full pill-shapes to distinguish them from structural UI elements.

## Components
- **Buttons:** Primary buttons are solid Electric Green with black text for maximum contrast. Secondary buttons use the Ghost Border with white text.
- **Search Inputs:** A unified horizontal bar with segment dividers. On click, segments expand with a subtle light-gray background to indicate focus, mimicking a premium concierge experience.
- **Sleek Cards:** Cards feature a 1px border. The image has a subtle gradient overlay at the bottom to ensure white text (Price/Rating) is legible over varied photography.
- **Chips:** Used for pitch features (e.g., "5-a-side", "Indoor", "Artificial Grass"). These use a dark gray fill and white text to remain secondary to the main CTA.
- **Admin Dashboard:** Uses high-density tables with JetBrains Mono for numeric data. Row highlights on hover use a subtle 5% opacity green tint.
- **Booking Calendar:** A custom grid where "Available" slots are outlined in green, and "Selected" slots are fully filled with the primary green accent.