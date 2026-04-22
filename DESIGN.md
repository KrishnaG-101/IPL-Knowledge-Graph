---
name: Deep Space Mission Control
colors:
  surface: '#161021'
  surface-dim: '#161021'
  surface-bright: '#3d3649'
  surface-container-lowest: '#110b1c'
  surface-container-low: '#1f192a'
  surface-container: '#231d2e'
  surface-container-high: '#2d2739'
  surface-container-highest: '#383244'
  on-surface: '#e9def6'
  on-surface-variant: '#cbc4cb'
  inverse-surface: '#e9def6'
  inverse-on-surface: '#342d40'
  outline: '#958f95'
  outline-variant: '#49454b'
  surface-tint: '#cec2d4'
  primary: '#cec2d4'
  on-primary: '#352d3b'
  primary-container: '#0a0510'
  on-primary-container: '#7e7585'
  inverse-primary: '#645b6a'
  secondary: '#44f6a3'
  on-secondary: '#003920'
  secondary-container: '#00d98a'
  on-secondary-container: '#005935'
  tertiary: '#ffb2b7'
  on-tertiary: '#67001c'
  tertiary-container: '#190003'
  on-tertiary-container: '#ee034c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ebdef1'
  primary-fixed-dim: '#cec2d4'
  on-primary-fixed: '#201926'
  on-primary-fixed-variant: '#4c4452'
  secondary-fixed: '#53ffac'
  secondary-fixed-dim: '#20e291'
  on-secondary-fixed: '#002111'
  on-secondary-fixed-variant: '#005231'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b7'
  on-tertiary-fixed: '#40000e'
  on-tertiary-fixed-variant: '#91002b'
  background: '#161021'
  on-background: '#e9def6'
  surface-variant: '#383244'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  data-mono-lg:
    fontFamily: monospace
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  body-base:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0.01em
  label-xs:
    fontFamily: monospace
    fontSize: 11px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 16px
  margin: 24px
---

## Brand & Style

The design system is engineered to evoke the high-stakes, data-dense atmosphere of a deep space mission control center, recontextualized for the strategic intensity of cricket. The brand personality is technical, analytical, and authoritative, targeting a sophisticated user base that values real-time tactical insights.

The aesthetic utilizes **Glassmorphism** and **High-Contrast HUD** elements to create a sense of depth and focus. The emotional response is one of "calm under pressure"—where the dark void of the background provides a non-distracting canvas for vibrant, glowing data streams. It avoids decorative clutter in favor of functional density, ensuring every pixel serves a statistical or navigational purpose.

## Colors

The color palette is anchored by a "Deep Space" purple that is nearly black, providing maximum contrast for the technical accents. 

- **Primary Background:** A void-like purple-black that eliminates glare and sets the "Mission Control" tone.
- **Secondary Accents (Emerald Green):** Used exclusively for active data, live scores, and "In-Play" statuses. It represents the "Go" signal in a flight check.
- **Highlight/Critical (Crimson Red):** Reserved for wickets, high-impact tactical shifts, and boundary alerts. 
- **Surface Tiers:** Muted, desaturated purples are used to define containers and cards, ensuring they remain distinct from the background without breaking the dark immersion.

## Typography

This design system utilizes **Space Grotesk** to bridge the gap between technical monospaced aesthetics and modern readability. While the system allows for monospaced overrides for scoreboards and numeric data-grids to ensure tabular alignment, Space Grotesk provides the geometric, futuristic edge required for mission control headings.

- **Data Density:** Numbers and player stats should utilize a monospaced stack (JetBrains Mono or system-mono) to maintain vertical alignment in lists.
- **Visual Hierarchy:** Use wide letter-spacing and uppercase transformations for small labels (e.g., "OVER RATE", "PROBABILITY") to mimic radar instrumentation.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy within a modular dashboard structure. The screen is treated as a single "Command Center" view, minimizing the need for scrolling by utilizing nested scrolling panels for player lists or ball-by-ball commentary.

- **The Grid:** A 12-column system with tight 16px gutters to maximize data density.
- **Rhythm:** A 4px base unit governs all padding and margins. 
- **Modular Panels:** Components are grouped into "Flight Deck" modules—distinct rectangular areas that house specific data clusters like "Strike Rotation" or "Win Probability."

## Elevation & Depth

In this design system, depth is conveyed through **Tonal Layering** and **Subtle Glows** rather than traditional shadows. Because the environment is "Deep Space," light sources are treated as emissive (coming from the data itself) rather than ambient.

- **Stacking:** Surface levels are defined by increasing the brightness of the purple hue. The further "forward" an element is, the lighter the purple becomes.
- **Glassmorphism:** Use a 12px backdrop blur on overlays and tooltips with a 10% white tint to simulate a glass HUD.
- **Inner Glows:** Active modules should have a 1px inner border in Emerald Green with a very soft (4px) outer blur to indicate "System Active" status.

## Shapes

The shape language is "Technical-Soft." While the atmosphere is futuristic, we avoid 0px sharp corners to prevent the UI from looking dated or hostile. 

- **Base Radius:** 4px (Soft) is the standard for cards and containers.
- **Interactive Elements:** Buttons and input fields follow the same 4px rule to maintain a consistent industrial look.
- **Circular Elements:** Reserved strictly for player avatars and "Ball" indicators in the over-view to provide a visual break from the rectangular grid.

## Components

### Buttons & Controls
- **Primary Action:** Emerald Green background with black text. On hover, add an external glow of the same color.
- **Ghost Action:** 1px Emerald Green border with transparent background.
- **Tactical Toggle:** Small, square-ish buttons that look like physical deck switches.

### Data Displays
- **Scoreboard:** Uses a high-contrast monospaced font. The current score should have a subtle emerald outer glow.
- **Charts/Graphs:** Line charts should use 2px strokes with a gradient "scanline" fill beneath the line.

### Cards & Modules
- **Modular Containers:** Defined by a 1px border (`#1A1425`). Headers within cards should have a subtle background tint to separate them from the card body.
- **Alert Cards:** When a wicket falls, the card border flashes Crimson Red with a 10% Crimson background overlay.

### Status Indicators
- **Live Pulse:** A small emerald dot with a breathing animation (opacity 1.0 to 0.4) next to the "Live" label.
- **Progress Bars:** Segmented bars (like a battery indicator) rather than a solid smooth fill, reinforcing the mechanical HUD feel.