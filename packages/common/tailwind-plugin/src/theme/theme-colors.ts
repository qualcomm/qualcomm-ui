/* eslint-disable */
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/** This file was generated automatically. Do not edit it directly. */

export interface ColorData {
  description?: string
  tailwindClasses: string[]
  variable: string
}

const background: ColorData[] = [
  {
    description: "Saturated brand fill — unmistakably the brand. Published components bind this (e.g. badges). Not for: architectural layers (→ color/surface/*); status regions (→ support/*).\nForeground: NO group-level guarantee — component owns and proves its own foreground per brand × theme. Scoped to FRAME_FILL, SHAPE_FILL.",
    tailwindClasses: ["bg-brand-primary"],
    variable: "--color-background-brand-primary",
  },
  {
    description: "Strongest brand fill — most emphatic brand statement. No published component currently binds this. Not for: architectural layers (→ color/surface/*); status regions (→ support/*).\nForeground: inverse guaranteed (text/neutral/inverse, icon/neutral/inverse). Scoped to FRAME_FILL, SHAPE_FILL.",
    tailwindClasses: ["bg-brand-primary-strong"],
    variable: "--color-background-brand-primary-strong",
  },
  {
    description: "Quiet brand presence — light brand wash for regions that carry product identity at low prominence (tinted badges, brand-tinted panels). Not for: architectural layers (→ color/surface/*); status regions (→ support/*).\nForeground: dark/neutral guaranteed (text/neutral/primary, icon/neutral/primary, icon/brand/primary, support icons). Not inverse. Scoped to FRAME_FILL, SHAPE_FILL.",
    tailwindClasses: ["bg-brand-primary-subtle"],
    variable: "--color-background-brand-primary-subtle",
  },
  {
    description: "Lightest neutral separation — tonal distinction from the surface, no meaning beyond that. Use for panels, bands, control fills. Caution: same value as color/surface/primary — pick by role: region → this; architectural layer → surface/*. Not for status (→ support/*).\nForeground: dark/neutral guaranteed (text/neutral/primary, text/neutral/secondary, text/brand/primary, all support). Not inverse. Scoped to FRAME_FILL, SHAPE_FILL.",
    tailwindClasses: ["bg-neutral-00"],
    variable: "--color-background-neutral-00",
  },
  {
    description: "Second-lightest neutral separation. Use for panels, bands, control fills. Caution: same value as color/surface/secondary — pick by role: region → this; architectural layer → surface/*. Not for status (→ support/*).\nForeground: dark/neutral guaranteed. Not inverse. Scoped to FRAME_FILL, SHAPE_FILL.",
    tailwindClasses: ["bg-neutral-01"],
    variable: "--color-background-neutral-01",
  },
  {
    description: "Third-rung neutral separation. Use for panels and bands needing more distinction from the surface. Caution: same value as support/neutral-subtle in some brands — pick by role: plain separation → this; neutral status → support/neutral-subtle. Not for status (→ support/*).\nForeground: dark/neutral guaranteed (most). Not inverse. Scoped to FRAME_FILL, SHAPE_FILL.",
    tailwindClasses: ["bg-neutral-02"],
    variable: "--color-background-neutral-02",
  },
  {
    description: "Highest neutral separation rung — most distinct while staying light. Not for status (→ support/*); not a step toward neutral/10 (that is a distinct inverse role).\nForeground: dark/neutral guaranteed (most). Not inverse. Scoped to FRAME_FILL, SHAPE_FILL.",
    tailwindClasses: ["bg-neutral-03"],
    variable: "--color-background-neutral-03",
  },
  {
    description: "Inverse neutral region — dark fill for light content (dark tooltips, dark badges). NOT a 4th rung of the separation ladder — a distinct inverse role. Not for: dark architectural layers (→ color/surface/*); status (→ support/*).\nForeground: inverse only (text/neutral/inverse, icon/neutral/inverse). Scoped to FRAME_FILL, SHAPE_FILL.",
    tailwindClasses: ["bg-neutral-10"],
    variable: "--color-background-neutral-10",
  },
  {
    description: "Loudest danger fill — small high-charge regions (status badges). Never same-charge foreground — signal collapse.\nForeground: inverse guaranteed (text/neutral/inverse, icon/neutral/inverse). Scoped to FRAME_FILL, SHAPE_FILL.",
    tailwindClasses: ["bg-support-danger"],
    variable: "--color-background-support-danger",
  },
  {
    description: "Clearly present danger signal. Not for: plain separation (→ neutral/*). Never same-charge foreground — signal collapse.\nForeground: text/neutral/primary and icon/neutral/primary only. Scoped to FRAME_FILL, SHAPE_FILL.",
    tailwindClasses: ["bg-support-danger-medium"],
    variable: "--color-background-support-danger-medium",
  },
  {
    description: "Calm danger signal — lightest danger fill, for full-width danger alerts. Pick charge by meaning, strength by prominence. Not for: plain separation (→ neutral/*); non-danger states. Never same-charge foreground — signal collapse; use neutral foreground.\nForeground: dark/neutral guaranteed (text/neutral/primary, text/neutral/secondary, text/support/danger, support icons). Scoped to FRAME_FILL, SHAPE_FILL.",
    tailwindClasses: ["bg-support-danger-subtle"],
    variable: "--color-background-support-danger-subtle",
  },
  {
    description: "Loudest info fill — small high-charge regions (status badges). Never same-charge foreground — signal collapse.\nForeground: inverse guaranteed (text/neutral/inverse, icon/neutral/inverse). Scoped to FRAME_FILL, SHAPE_FILL.",
    tailwindClasses: ["bg-support-info"],
    variable: "--color-background-support-info",
  },
  {
    description: "Clearly present info signal. Not for: plain separation (→ neutral/*). Never same-charge foreground — signal collapse.\nForeground: text/neutral/primary and icon/neutral/primary. Scoped to FRAME_FILL, SHAPE_FILL.",
    tailwindClasses: ["bg-support-info-medium"],
    variable: "--color-background-support-info-medium",
  },
  {
    description: "Calm info signal — lightest info fill, for full-width info alerts. Not for: plain separation (→ neutral/*); non-info states. Never same-charge foreground — signal collapse.\nForeground: dark/neutral guaranteed (text/neutral/primary, text/neutral/secondary, text/support/info, support icons). Scoped to FRAME_FILL, SHAPE_FILL.",
    tailwindClasses: ["bg-support-info-subtle"],
    variable: "--color-background-support-info-subtle",
  },
  {
    description: "Loudest grey status fill — dark fill for light content. Distinct from the neutral separation ladder. Never same-charge foreground — signal collapse.\nForeground: inverse guaranteed (text/neutral/inverse, icon/neutral/inverse). Scoped to FRAME_FILL, SHAPE_FILL.",
    tailwindClasses: ["bg-support-neutral"],
    variable: "--color-background-support-neutral",
  },
  {
    description: "Clearly present grey status signal. No published component currently binds this. Never same-charge foreground — signal collapse.\nForeground: text/neutral/primary, icon/neutral/primary. Scoped to FRAME_FILL, SHAPE_FILL.",
    tailwindClasses: ["bg-support-neutral-medium"],
    variable: "--color-background-support-neutral-medium",
  },
  {
    description: "Calm grey status signal — lightest neutral-status fill. Distinct from the neutral separation ladder (neutral/00–03), which has no status meaning. Caution: same value as neutral/02 in some brands — pick by role: plain separation → neutral/02; status → this. Never same-charge foreground — signal collapse.\nForeground: dark/neutral guaranteed (text/neutral/primary, text/neutral/secondary, support icons). Scoped to FRAME_FILL, SHAPE_FILL.",
    tailwindClasses: ["bg-support-neutral-subtle"],
    variable: "--color-background-support-neutral-subtle",
  },
  {
    description: "Loudest success fill — small high-charge regions (status badges). Never same-charge foreground — signal collapse.\nForeground: inverse guaranteed (text/neutral/inverse, icon/neutral/inverse). Scoped to FRAME_FILL, SHAPE_FILL.",
    tailwindClasses: ["bg-support-success"],
    variable: "--color-background-support-success",
  },
  {
    description: "Clearly present success signal. Not for: plain separation (→ neutral/*). Never same-charge foreground — signal collapse.\nForeground: text/neutral/primary, icon/neutral/primary, icon/neutral/secondary. Scoped to FRAME_FILL, SHAPE_FILL.",
    tailwindClasses: ["bg-support-success-medium"],
    variable: "--color-background-support-success-medium",
  },
  {
    description: "Calm success signal — lightest success fill, for full-width success alerts. Not for: plain separation (→ neutral/*); non-success states. Never same-charge foreground — signal collapse.\nForeground: dark/neutral guaranteed (text/neutral/primary, text/neutral/secondary, text/support/success, support icons). Scoped to FRAME_FILL, SHAPE_FILL.",
    tailwindClasses: ["bg-support-success-subtle"],
    variable: "--color-background-support-success-subtle",
  },
  {
    description: "Loudest warning fill. Never same-charge foreground. WARNING EXCEPTION: persistent black foreground only — no neutral or inverse foreground clears this yellow across all brands × themes. Scoped to FRAME_FILL, SHAPE_FILL.",
    tailwindClasses: ["bg-support-warning"],
    variable: "--color-background-support-warning",
  },
  {
    description: "Clearly present warning signal. Not for: plain separation (→ neutral/*). Never same-charge foreground — signal collapse.\nForeground: text/neutral/primary, icon/neutral/primary, icon/neutral/secondary, icon/support/neutral. Scoped to FRAME_FILL, SHAPE_FILL.",
    tailwindClasses: ["bg-support-warning-medium"],
    variable: "--color-background-support-warning-medium",
  },
  {
    description: "Calm warning signal — lightest warning fill, for full-width warning alerts. Not for: plain separation (→ neutral/*); non-warning states. Never same-charge foreground — signal collapse.\nForeground: dark/neutral guaranteed (text/neutral/primary, text/neutral/secondary, text/brand/primary, support icons). Scoped to FRAME_FILL, SHAPE_FILL.",
    tailwindClasses: ["bg-support-warning-subtle"],
    variable: "--color-background-support-warning-subtle",
  },
]

const border: ColorData[] = [
  {
    description: "Saturated brand edge — product identity, bound in published components (e.g. active-tab underline). Not for: structural-only edges (→ neutral family); state edges (→ support/*); fills. Contrast: verify 3:1 at point of use if the only state indicator. Scoped to STROKE_COLOR.",
    tailwindClasses: ["border-brand-primary"],
    variable: "--color-border-brand-primary",
  },
  {
    description: "Quieter brand edge — product identity at lower prominence. No published component currently binds this. Not for: structural-only edges (→ neutral family); state edges (→ support/*); fills. Contrast: verify 3:1 at point of use if the only state indicator. Scoped to STROKE_COLOR.",
    tailwindClasses: ["border-brand-primary-subtle"],
    variable: "--color-border-brand-primary-subtle",
  },
  {
    description: "Opaque light structural edge — lightest neutral boundary that holds a fixed colour. Use for card outlines, panel seams, input borders at rest. Not for: state edges (→ support/*); brand edges (→ brand/*); fills. Contrast: if the only visible boundary indicator, verify 3:1 at point of use (WCAG 1.4.11). Scoped to STROKE_COLOR.",
    tailwindClasses: ["border-neutral-00"],
    variable: "--color-border-neutral-00",
  },
  {
    description: "Translucent structural edge — faintest hairline; adapts to the surface beneath (grey on light, light on dark). Chain stops at Theme (opacity literal). Prefer over opaque where the edge must adapt across surfaces or themes. Not for: state edges (→ support/*); fills. Contrast: translucent — verify 3:1 against effective adjacent colour at point of use. Scoped to STROKE_COLOR.",
    tailwindClasses: ["border-neutral-01"],
    variable: "--color-border-neutral-01",
  },
  {
    description: "Translucent structural edge — mid-rung; more visible than 01, less assertive than 03; adapts to the surface beneath. Chain stops at Theme (opacity literal). Not for: state edges (→ support/*); fills. Contrast: verify 3:1 against effective adjacent colour at point of use. Scoped to STROKE_COLOR.",
    tailwindClasses: ["border-neutral-02"],
    variable: "--color-border-neutral-02",
  },
  {
    description: "Translucent structural edge — firmest rung while still adapting to the surface beneath. Chain stops at Theme (opacity literal). Not for: state edges (→ support/*); fills. Contrast: verify 3:1 against effective adjacent colour at point of use. Scoped to STROKE_COLOR.",
    tailwindClasses: ["border-neutral-03"],
    variable: "--color-border-neutral-03",
  },
  {
    description: "Opaque dark (inverse) structural edge — fixed dark colour regardless of backdrop. Distinct role, NOT the continuation of the translucent ladder. Not for: state edges (→ support/*); brand edges; fills. Contrast: verify 3:1 at point of use. Scoped to STROKE_COLOR.",
    tailwindClasses: ["border-neutral-10"],
    variable: "--color-border-neutral-10",
  },
  {
    description: "Semantic edge — loudest danger signal. No published component currently binds this bare strength. Not for: structural separation (→ neutral family); fills. Never on a danger-coloured fill (signal collapse). Contrast: 3:1 at point of use (WCAG 1.4.11). Scoped to STROKE_COLOR.",
    tailwindClasses: ["border-support-danger"],
    variable: "--color-border-support-danger",
  },
  {
    description: "Semantic edge — clearly present danger signal; the bound danger-charged edge in published components. Use for error outlines on failing fields, framed edge of danger alerts. Not for: structural separation (→ neutral family). Never on a danger-coloured fill (signal collapse). Contrast: 3:1 at point of use. Scoped to STROKE_COLOR.",
    tailwindClasses: ["border-support-danger-medium"],
    variable: "--color-border-support-danger-medium",
  },
  {
    description: "Semantic edge — loudest info signal. No published component currently binds this bare strength. Not for: structural separation; fills. Never on an info-coloured fill (signal collapse). Contrast: 3:1 at point of use. Scoped to STROKE_COLOR.",
    tailwindClasses: ["border-support-info"],
    variable: "--color-border-support-info",
  },
  {
    description: "Semantic edge — clearly present info signal; the bound info-charged edge in published components. Use for framed edge of info alerts/notices. Never on an info-coloured fill (signal collapse). Contrast: 3:1 at point of use. Scoped to STROKE_COLOR.",
    tailwindClasses: ["border-support-info-medium"],
    variable: "--color-border-support-info-medium",
  },
  {
    description: "Semantic edge — loudest grey status signal. Distinct from the neutral SEPARATION family (which marks structure with no meaning). No published component currently binds this bare strength. Never on a neutral-status-coloured fill (signal collapse). Contrast: 3:1 at point of use. Scoped to STROKE_COLOR.",
    tailwindClasses: ["border-support-neutral"],
    variable: "--color-border-support-neutral",
  },
  {
    description: "Semantic edge — clearly present grey status signal; the bound neutral-status-charged edge in published components. Distinct from the neutral separation family. Never on a neutral-status-coloured fill (signal collapse). Contrast: 3:1 at point of use. Scoped to STROKE_COLOR.",
    tailwindClasses: ["border-support-neutral-medium"],
    variable: "--color-border-support-neutral-medium",
  },
  {
    description: "Semantic edge — loudest success signal. No published component currently binds this bare strength. Never on a success-coloured fill (signal collapse). Contrast: 3:1 at point of use. Scoped to STROKE_COLOR.",
    tailwindClasses: ["border-support-success"],
    variable: "--color-border-support-success",
  },
  {
    description: "Semantic edge — clearly present success signal; the bound success-charged edge in published components. Use for framed edge of success alerts/notifications. Never on a success-coloured fill (signal collapse). Contrast: 3:1 at point of use. Scoped to STROKE_COLOR.",
    tailwindClasses: ["border-support-success-medium"],
    variable: "--color-border-support-success-medium",
  },
  {
    description: "Semantic edge — loudest warning signal. No published component currently binds this bare strength. Never on a warning-coloured fill (signal collapse). Contrast: 3:1 at point of use. Scoped to STROKE_COLOR.",
    tailwindClasses: ["border-support-warning"],
    variable: "--color-border-support-warning",
  },
  {
    description: "Semantic edge — clearly present warning signal; the bound warning-charged edge in published components. Use for framed edge of warning alerts. Never on a warning-coloured fill (signal collapse). Contrast: 3:1 at point of use. Scoped to STROKE_COLOR.",
    tailwindClasses: ["border-support-warning-medium"],
    variable: "--color-border-support-warning-medium",
  },
  {
    description: "Disabled border — translucent. Caution: same value as opacity/04 — pick by mechanic. Use alongside disabled/background, /icon, /text. Not for enabled content. Scoped to STROKE_COLOR.",
    tailwindClasses: ["border-disabled"],
    variable: "--color-utility-disabled-border",
  },
  {
    description: "Disabled border — inverse context (dark backdrop). Use alongside disabled/inverse/background, /icon, /text. Not for everyday context (→ disabled/border). Scoped to STROKE_COLOR.",
    tailwindClasses: ["border-disabled-inverse"],
    variable: "--color-utility-disabled-inverse-border",
  },
  {
    description: "Disabled border — persistent/black context. Use alongside persistent/black/background, /icon, /text. Scoped to STROKE_COLOR.",
    tailwindClasses: ["border-disabled-persistent-black"],
    variable: "--color-utility-disabled-persistent-black-border",
  },
  {
    description: "Disabled border — persistent/white context. Use alongside persistent/white/background, /icon, /text. Not for everyday or inverse contexts. Scoped to STROKE_COLOR.",
    tailwindClasses: ["border-disabled-persistent-white"],
    variable: "--color-utility-disabled-persistent-white-border",
  },
  {
    description: "Keyboard-focus ring — the visible indicator of which control holds focus. Lives in color/utility/*, NOT color/border/*. Published focusable controls bind this internally. Not for: structural or charged edges (→ color/border/*); brand edges even when value coincides — pick by mechanic. Must clear 3:1 against adjacent colours (WCAG 1.4.11), verified at point of use. Scoped to STROKE_COLOR.",
    tailwindClasses: ["border-focus"],
    variable: "--color-utility-focus-border",
  },
]

const category: ColorData[] = [
  {
    description: "Amber — medium strength. Distinguish set members — no meaning in the hue; assign by position and hold. Currently unbound by any published component. Not for: status (→ support/*); brand identity; implying rank.\nForeground: icon/neutral/primary guaranteed on all hues. Secondary/inverse NOT guaranteed. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: ["bg-category-amber-medium", "text-category-amber-medium"],
    variable: "--color-category-amber-medium",
  },
  {
    description: "Amber — strong (saturated). Distinguish set members. Badge uses strong tokens; strong tokens also appear as border bindings. Not for: status (→ support/*); brand identity; implying rank. Foreground is component-owned at this strength — check Guarantees before placing text on a strong fill.\nForeground: icon/neutral/primary and icon/neutral/inverse guaranteed. Text foregrounds are Manual — treat as component-owned for text. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: ["bg-category-amber-strong", "text-category-amber-strong"],
    variable: "--color-category-amber-strong",
  },
  {
    description: "Amber — subtle (light fill). Distinguish set members — no meaning in the hue; assign by position and hold across all views. Badge uses subtle tokens. Not for: status (→ support/*); brand identity (→ brand/*); implying rank.\nForeground: text/neutral/primary and icon/neutral/primary guaranteed. text/neutral/secondary NOT guaranteed (manual). Multi-scope: match to the property (fill/text/stroke). Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: ["bg-category-amber-subtle", "text-category-amber-subtle"],
    variable: "--color-category-amber-subtle",
  },
  {
    description: "Blue — medium strength. Distinguish set members — no meaning in the hue; assign by position and hold. Currently unbound by any published component. Not for: status (→ support/*); brand identity; implying rank.\nForeground: icon/neutral/primary guaranteed on all hues. Secondary/inverse NOT guaranteed. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: ["bg-category-blue-medium", "text-category-blue-medium"],
    variable: "--color-category-blue-medium",
  },
  {
    description: "Blue — strong (saturated). Distinguish set members. Badge uses strong tokens; strong tokens also appear as border bindings. Not for: status (→ support/*); brand identity; implying rank. Foreground is component-owned at this strength — check Guarantees before placing text on a strong fill.\nForeground: icon/neutral/primary and icon/neutral/inverse guaranteed. Text foregrounds are Manual — treat as component-owned for text. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: ["bg-category-blue-strong", "text-category-blue-strong"],
    variable: "--color-category-blue-strong",
  },
  {
    description: "Blue — subtle (light fill). Distinguish set members — no meaning in the hue; assign by position and hold across all views. Badge uses subtle tokens. Not for: status (→ support/*); brand identity (→ brand/*); implying rank.\nForeground: text/neutral/primary and icon/neutral/primary guaranteed. text/neutral/secondary NOT guaranteed (manual). Multi-scope: match to the property (fill/text/stroke). Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: ["bg-category-blue-subtle", "text-category-blue-subtle"],
    variable: "--color-category-blue-subtle",
  },
  {
    description: "Cyan — medium strength. Distinguish set members — no meaning in the hue; assign by position and hold. Currently unbound by any published component. Not for: status (→ support/*); brand identity; implying rank.\nForeground: icon/neutral/primary guaranteed on all hues. Secondary/inverse NOT guaranteed. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: ["bg-category-cyan-medium", "text-category-cyan-medium"],
    variable: "--color-category-cyan-medium",
  },
  {
    description: "Cyan — strong (saturated). Distinguish set members. Badge uses strong tokens; strong tokens also appear as border bindings. Not for: status (→ support/*); brand identity; implying rank. Foreground is component-owned at this strength — check Guarantees before placing text on a strong fill.\nForeground: icon/neutral/primary and icon/neutral/inverse guaranteed. Text foregrounds are Manual — treat as component-owned for text. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: ["bg-category-cyan-strong", "text-category-cyan-strong"],
    variable: "--color-category-cyan-strong",
  },
  {
    description: "Cyan — subtle (light fill). Distinguish set members — no meaning in the hue; assign by position and hold across all views. Badge uses subtle tokens. Not for: status (→ support/*); brand identity (→ brand/*); implying rank.\nForeground: text/neutral/primary and icon/neutral/primary guaranteed. text/neutral/secondary NOT guaranteed (manual). Multi-scope: match to the property (fill/text/stroke). Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: ["bg-category-cyan-subtle", "text-category-cyan-subtle"],
    variable: "--color-category-cyan-subtle",
  },
  {
    description: "Green — medium strength. Distinguish set members — no meaning in the hue; assign by position and hold. Currently unbound by any published component. Proximity: avoid adjacent to success indicators. Not for: status (→ support/*); brand identity; implying rank.\nForeground: icon/neutral/primary guaranteed on all hues. Secondary/inverse NOT guaranteed. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: ["bg-category-green-medium", "text-category-green-medium"],
    variable: "--color-category-green-medium",
  },
  {
    description: "Green — strong (saturated). Distinguish set members. Badge uses strong tokens; strong tokens also appear as border bindings. Proximity: avoid adjacent to success indicators. Not for: status (→ support/*); brand identity; implying rank. Foreground is component-owned at this strength — check Guarantees before placing text on a strong fill.\nForeground: No foreground guaranteed at green/strong — all Manual. Verify every pairing or let the component own it. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: ["bg-category-green-strong", "text-category-green-strong"],
    variable: "--color-category-green-strong",
  },
  {
    description: "Green — subtle (light fill). Distinguish set members — no meaning in the hue; assign by position and hold across all views. Badge uses subtle tokens. Proximity: avoid adjacent to success indicators. Not for: status (→ support/*); brand identity (→ brand/*); implying rank.\nForeground: text/neutral/primary and icon/neutral/primary guaranteed. text/neutral/secondary NOT guaranteed (manual). Multi-scope: match to the property (fill/text/stroke). Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: ["bg-category-green-subtle", "text-category-green-subtle"],
    variable: "--color-category-green-subtle",
  },
  {
    description: "Lime — medium strength. Distinguish set members — no meaning in the hue; assign by position and hold. Currently unbound by any published component. Not for: status (→ support/*); brand identity; implying rank.\nForeground: icon/neutral/primary guaranteed on all hues. Secondary/inverse NOT guaranteed. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: ["bg-category-lime-medium", "text-category-lime-medium"],
    variable: "--color-category-lime-medium",
  },
  {
    description: "Lime — strong (saturated). Distinguish set members. Badge uses strong tokens; strong tokens also appear as border bindings. Not for: status (→ support/*); brand identity; implying rank. Foreground is component-owned at this strength — check Guarantees before placing text on a strong fill.\nForeground: No foreground guaranteed at lime/strong — all Manual. Verify every pairing or let the component own it. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: ["bg-category-lime-strong", "text-category-lime-strong"],
    variable: "--color-category-lime-strong",
  },
  {
    description: "Lime — subtle (light fill). Distinguish set members — no meaning in the hue; assign by position and hold across all views. Badge uses subtle tokens. Not for: status (→ support/*); brand identity (→ brand/*); implying rank.\nForeground: text/neutral/primary and icon/neutral/primary guaranteed. text/neutral/secondary NOT guaranteed (manual). Multi-scope: match to the property (fill/text/stroke). Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: ["bg-category-lime-subtle", "text-category-lime-subtle"],
    variable: "--color-category-lime-subtle",
  },
  {
    description: "Magenta — medium strength. Distinguish set members — no meaning in the hue; assign by position and hold. Currently unbound by any published component. Not for: status (→ support/*); brand identity; implying rank.\nForeground: icon/neutral/primary guaranteed on all hues. Secondary/inverse NOT guaranteed. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: [
      "bg-category-magenta-medium",
      "text-category-magenta-medium",
    ],
    variable: "--color-category-magenta-medium",
  },
  {
    description: "Magenta — strong (saturated). Distinguish set members. Badge uses strong tokens; strong tokens also appear as border bindings. Not for: status (→ support/*); brand identity; implying rank. Foreground is component-owned at this strength — check Guarantees before placing text on a strong fill.\nForeground: No foreground guaranteed at magenta/strong — all Manual. Verify every pairing or let the component own it. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: [
      "bg-category-magenta-strong",
      "text-category-magenta-strong",
    ],
    variable: "--color-category-magenta-strong",
  },
  {
    description: "Magenta — subtle (light fill). Distinguish set members — no meaning in the hue; assign by position and hold across all views. Badge uses subtle tokens. Not for: status (→ support/*); brand identity (→ brand/*); implying rank.\nForeground: text/neutral/primary and icon/neutral/primary guaranteed. text/neutral/secondary NOT guaranteed (manual). Multi-scope: match to the property (fill/text/stroke). Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: [
      "bg-category-magenta-subtle",
      "text-category-magenta-subtle",
    ],
    variable: "--color-category-magenta-subtle",
  },
  {
    description: "Orange — medium strength. Distinguish set members — no meaning in the hue; assign by position and hold. Currently unbound by any published component. Not for: status (→ support/*); brand identity; implying rank.\nForeground: icon/neutral/primary guaranteed on all hues. Secondary/inverse NOT guaranteed. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: [
      "bg-category-orange-medium",
      "text-category-orange-medium",
    ],
    variable: "--color-category-orange-medium",
  },
  {
    description: "Orange — strong (saturated). Distinguish set members. Badge uses strong tokens; strong tokens also appear as border bindings. Not for: status (→ support/*); brand identity; implying rank. Foreground is component-owned at this strength — check Guarantees before placing text on a strong fill.\nForeground: icon/neutral/primary and icon/neutral/inverse guaranteed. Text foregrounds are Manual — treat as component-owned for text. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: [
      "bg-category-orange-strong",
      "text-category-orange-strong",
    ],
    variable: "--color-category-orange-strong",
  },
  {
    description: "Orange — subtle (light fill). Distinguish set members — no meaning in the hue; assign by position and hold across all views. Badge uses subtle tokens. Not for: status (→ support/*); brand identity (→ brand/*); implying rank.\nForeground: text/neutral/primary and icon/neutral/primary guaranteed. text/neutral/secondary NOT guaranteed (manual). Multi-scope: match to the property (fill/text/stroke). Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: [
      "bg-category-orange-subtle",
      "text-category-orange-subtle",
    ],
    variable: "--color-category-orange-subtle",
  },
  {
    description: "Purple — medium strength. Distinguish set members — no meaning in the hue; assign by position and hold. Currently unbound by any published component. Not for: status (→ support/*); brand identity; implying rank.\nForeground: icon/neutral/primary guaranteed on all hues. Secondary/inverse NOT guaranteed. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: [
      "bg-category-purple-medium",
      "text-category-purple-medium",
    ],
    variable: "--color-category-purple-medium",
  },
  {
    description: "Purple — strong (saturated). Distinguish set members. Badge uses strong tokens; strong tokens also appear as border bindings. Not for: status (→ support/*); brand identity; implying rank. Foreground is component-owned at this strength — check Guarantees before placing text on a strong fill.\nForeground: No foreground guaranteed at purple/strong — all Manual. Verify every pairing or let the component own it. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: [
      "bg-category-purple-strong",
      "text-category-purple-strong",
    ],
    variable: "--color-category-purple-strong",
  },
  {
    description: "Purple — subtle (light fill). Distinguish set members — no meaning in the hue; assign by position and hold across all views. Badge uses subtle tokens. Not for: status (→ support/*); brand identity (→ brand/*); implying rank.\nForeground: text/neutral/primary and icon/neutral/primary guaranteed. text/neutral/secondary NOT guaranteed (manual). Multi-scope: match to the property (fill/text/stroke). Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: [
      "bg-category-purple-subtle",
      "text-category-purple-subtle",
    ],
    variable: "--color-category-purple-subtle",
  },
  {
    description: "Red — medium strength. Distinguish set members — no meaning in the hue; assign by position and hold. Currently unbound by any published component. Proximity: avoid adjacent to danger indicators. Not for: status (→ support/*); brand identity; implying rank.\nForeground: icon/neutral/primary guaranteed on all hues. Secondary/inverse NOT guaranteed. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: ["bg-category-red-medium", "text-category-red-medium"],
    variable: "--color-category-red-medium",
  },
  {
    description: "Red — strong (saturated). Distinguish set members. Badge uses strong tokens; strong tokens also appear as border bindings. Proximity: avoid adjacent to danger indicators. Not for: status (→ support/*); brand identity; implying rank. Foreground is component-owned at this strength — check Guarantees before placing text on a strong fill.\nForeground: icon/neutral/primary and icon/neutral/inverse guaranteed. Text foregrounds are Manual — treat as component-owned for text. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: ["bg-category-red-strong", "text-category-red-strong"],
    variable: "--color-category-red-strong",
  },
  {
    description: "Red — subtle (light fill). Distinguish set members — no meaning in the hue; assign by position and hold across all views. Badge uses subtle tokens. Proximity: avoid adjacent to danger indicators. Not for: status (→ support/*); brand identity (→ brand/*); implying rank.\nForeground: text/neutral/primary and icon/neutral/primary guaranteed. text/neutral/secondary NOT guaranteed (manual). Multi-scope: match to the property (fill/text/stroke). Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: ["bg-category-red-subtle", "text-category-red-subtle"],
    variable: "--color-category-red-subtle",
  },
  {
    description: "Teal — medium strength. Distinguish set members — no meaning in the hue; assign by position and hold. Currently unbound by any published component. Not for: status (→ support/*); brand identity; implying rank.\nForeground: icon/neutral/primary guaranteed on all hues. Secondary/inverse NOT guaranteed. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: ["bg-category-teal-medium", "text-category-teal-medium"],
    variable: "--color-category-teal-medium",
  },
  {
    description: "Teal — strong (saturated). Distinguish set members. Badge uses strong tokens; strong tokens also appear as border bindings. Not for: status (→ support/*); brand identity; implying rank. Foreground is component-owned at this strength — check Guarantees before placing text on a strong fill.\nForeground: icon/neutral/primary and icon/neutral/inverse guaranteed. Text foregrounds are Manual — treat as component-owned for text. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: ["bg-category-teal-strong", "text-category-teal-strong"],
    variable: "--color-category-teal-strong",
  },
  {
    description: "Teal — subtle (light fill). Distinguish set members — no meaning in the hue; assign by position and hold across all views. Badge uses subtle tokens. Not for: status (→ support/*); brand identity (→ brand/*); implying rank.\nForeground: text/neutral/primary and icon/neutral/primary guaranteed. text/neutral/secondary NOT guaranteed (manual). Multi-scope: match to the property (fill/text/stroke). Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: ["bg-category-teal-subtle", "text-category-teal-subtle"],
    variable: "--color-category-teal-subtle",
  },
  {
    description: "Violet — medium strength. Distinguish set members — no meaning in the hue; assign by position and hold. Currently unbound by any published component. Not for: status (→ support/*); brand identity; implying rank.\nForeground: icon/neutral/primary guaranteed on all hues. Secondary/inverse NOT guaranteed. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: [
      "bg-category-violet-medium",
      "text-category-violet-medium",
    ],
    variable: "--color-category-violet-medium",
  },
  {
    description: "Violet — strong (saturated). Distinguish set members. Badge uses strong tokens; strong tokens also appear as border bindings. Not for: status (→ support/*); brand identity; implying rank. Foreground is component-owned at this strength — check Guarantees before placing text on a strong fill.\nForeground: icon/neutral/primary and icon/neutral/inverse guaranteed. Text foregrounds are Manual — treat as component-owned for text. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: [
      "bg-category-violet-strong",
      "text-category-violet-strong",
    ],
    variable: "--color-category-violet-strong",
  },
  {
    description: "Violet — subtle (light fill). Distinguish set members — no meaning in the hue; assign by position and hold across all views. Badge uses subtle tokens. Not for: status (→ support/*); brand identity (→ brand/*); implying rank.\nForeground: text/neutral/primary and icon/neutral/primary guaranteed. text/neutral/secondary NOT guaranteed (manual). Multi-scope: match to the property (fill/text/stroke). Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: [
      "bg-category-violet-subtle",
      "text-category-violet-subtle",
    ],
    variable: "--color-category-violet-subtle",
  },
  {
    description: "Yellow — medium strength. Distinguish set members — no meaning in the hue; assign by position and hold. Currently unbound by any published component. Proximity: avoid adjacent to warning indicators. Not for: status (→ support/*); brand identity; implying rank.\nForeground: icon/neutral/primary guaranteed on all hues. EXCEPTION: text/neutral/primary is Manual only at yellow/medium. Secondary/inverse NOT guaranteed. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: [
      "bg-category-yellow-medium",
      "text-category-yellow-medium",
    ],
    variable: "--color-category-yellow-medium",
  },
  {
    description: "Yellow — strong (saturated). Distinguish set members. Badge uses strong tokens; strong tokens also appear as border bindings. Proximity: avoid adjacent to warning indicators. Not for: status (→ support/*); brand identity; implying rank. Foreground is component-owned at this strength — check Guarantees before placing text on a strong fill.\nForeground: YELLOW EXCEPTION: no foreground guaranteed — everything Manual across brands × themes. Verify every placement or let the component own the pairing. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: [
      "bg-category-yellow-strong",
      "text-category-yellow-strong",
    ],
    variable: "--color-category-yellow-strong",
  },
  {
    description: "Yellow — subtle (light fill). Distinguish set members — no meaning in the hue; assign by position and hold across all views. Badge uses subtle tokens. Proximity: avoid adjacent to warning indicators. Not for: status (→ support/*); brand identity (→ brand/*); implying rank.\nForeground: text/neutral/primary and icon/neutral/primary guaranteed. text/neutral/secondary NOT guaranteed (manual). Multi-scope: match to the property (fill/text/stroke). Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    tailwindClasses: [
      "bg-category-yellow-subtle",
      "text-category-yellow-subtle",
    ],
    variable: "--color-category-yellow-subtle",
  },
]

const icon: ColorData[] = [
  {
    description: "Brand-coloured icon — product-identity glyph, standalone. Not for: plain affordances (→ neutral family; brand is identity, not a generic accent); status glyphs (→ support/*); in-control glyphs (component owns).\nGuaranteed 3:1: all 4 surfaces, light neutral ladder, subtle support + subtle categorical. Manual on categorical-medium/strong. Not on strong same-charge support. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    tailwindClasses: ["text-icon-brand-primary"],
    variable: "--color-icon-brand-primary",
  },
  {
    description: "Neutral icon voice on flipping backdrops — saturated fills, dark neutral background. Not a &quot;white icon&quot;. Prefer over mode override for flipping backdrops. Not for: stable backdrops (→ neutral/primary; inverse near-zero contrast in one theme).\nGuaranteed 3:1: dark neutral, strong brand, saturated same-charge support (danger/info/success/neutral). Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    tailwindClasses: ["text-icon-neutral-inverse"],
    variable: "--color-icon-neutral-inverse",
  },
  {
    description: "Neutral icon at full strength — standalone glyphs (category symbols, chevrons, marks beside labels). Not for: icons inside interactive controls (component owns — test is per-brand component/* tokens, NOT fill); charged glyphs (→ support/*); brand glyphs (→ brand/primary).\nGuaranteed 3:1: all 4 surfaces, light neutral ladder, subtle/medium support + categorical. Not on dark neutral or strong fills. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    tailwindClasses: ["text-icon-neutral-primary"],
    variable: "--color-icon-neutral-primary",
  },
  {
    description: "Neutral icon, quieter — supporting glyphs alongside secondary content. Not for: load-bearing glyphs (→ neutral/primary); in-control glyphs (component owns).\nGuaranteed 3:1: all 4 surfaces, light neutral ladder, subtle support + subtle categorical. Manual on categorical-medium, dark neutral. Not on strong fills. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    tailwindClasses: ["text-icon-neutral-secondary"],
    variable: "--color-icon-neutral-secondary",
  },
  {
    description: "Semantic icon — danger charge, cues &quot;wrong&quot;. Not for: decorative use (drains signal); plain marking (→ neutral family); in-control glyphs. Never on danger-coloured fill (signal collapse — use neutral/inverse).\nGuaranteed 3:1: all 4 surfaces, lighter neutral + subtle support. Not on same-charge fill. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    tailwindClasses: ["text-icon-support-danger"],
    variable: "--color-icon-support-danger",
  },
  {
    description: "Semantic icon — info charge. Not for: decorative use; plain marking (→ neutral family); in-control glyphs. Never on info-coloured fill (signal collapse).\nGuaranteed 3:1: all 4 surfaces and lighter backgrounds. Not on same-charge fill. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    tailwindClasses: ["text-icon-support-info"],
    variable: "--color-icon-support-info",
  },
  {
    description: "Semantic icon — grey status charge (distinct from the neutral icon FAMILY, which does plain unmarked marking). Not for: plain marking (→ neutral/primary or secondary — &quot;neutral&quot; means different things in these two families); in-control glyphs. Never on neutral-status-coloured fill (signal collapse).\nGuaranteed 3:1: all 4 surfaces and lighter backgrounds. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    tailwindClasses: ["text-icon-support-neutral"],
    variable: "--color-icon-support-neutral",
  },
  {
    description: "Semantic icon — success charge. Not for: decorative use; plain marking (→ neutral family); in-control glyphs. Never on success-coloured fill (signal collapse).\nGuaranteed 3:1: all 4 surfaces and lighter backgrounds. Not on same-charge fill. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    tailwindClasses: ["text-icon-support-success"],
    variable: "--color-icon-support-success",
  },
  {
    description: "Semantic icon — warning charge (&quot;proceed carefully&quot;, not &quot;wrong&quot;). Not for: error conditions (→ danger); decorative use; in-control glyphs. Never on warning-coloured fill.\nCONTRAST WARNING: low-luminance yellow — Manual across nearly every backdrop. Verify per brand × theme for every placement. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    tailwindClasses: ["text-icon-support-warning"],
    variable: "--color-icon-support-warning",
  },
]

const surface: ColorData[] = [
  {
    description: "Floating surface — dialogs, popovers, menus, context menus, tooltips, toasts, dropdowns. Pair with elevation/shadow/* or color/border/*. Not for: cards/layout content (→ raised); canvas/nav (→ primary/secondary); fills inside an overlay (→ color/background/*). Scoped to FRAME_FILL, SHAPE_FILL.",
    tailwindClasses: ["bg-overlay"],
    variable: "--color-surface-overlay",
  },
  {
    description: "Architectural surface — canvas, header, side nav, footer, persistent panels. Peer to secondary; neither is more elevated. Not for: cards (→ raised); dialogs/menus (→ overlay); coloured fills on a surface (→ color/background/*). Scoped to FRAME_FILL, SHAPE_FILL.",
    tailwindClasses: ["bg-primary"],
    variable: "--color-surface-primary",
  },
  {
    description: "Elevated-content surface — cards, content tiles, grouped blocks sitting above the canvas but part of the layout. Pair with elevation/shadow/* or color/border/* to make the lift visible. Not for: canvas/header/nav (→ primary/secondary); dialogs/tooltips (→ overlay); fills inside a card (→ color/background/*). Scoped to FRAME_FILL, SHAPE_FILL.",
    tailwindClasses: ["bg-raised"],
    variable: "--color-surface-raised",
  },
  {
    description: "Architectural surface — same role as primary, second tonal option for composing contrast within the interface structure. Not for: cards (→ raised); dialogs/menus (→ overlay); coloured fills on a surface (→ color/background/*). Scoped to FRAME_FILL, SHAPE_FILL.",
    tailwindClasses: ["bg-secondary"],
    variable: "--color-surface-secondary",
  },
]

const text: ColorData[] = [
  {
    description: "The product asserting itself — calls to action, brand emphasis, featured statements. Sparing by design — overuse drains the signal. Not for: main reading content (→ neutral/primary); supporting content (→ secondary); semantic states (→ support/*); medium/strong fills.\nGuaranteed AA: all 4 surfaces, neutral 00–01 (02–03 manual), subtle support (danger/info/success/warning). Scoped to TEXT_FILL.",
    tailwindClasses: ["text-brand-primary"],
    variable: "--color-text-brand-primary",
  },
  {
    description: "Neutral voice on backdrops whose tonal value flips across themes — saturated semantic fills, dark neutral background, inverse interactive surfaces. Not a &quot;white text&quot; token. Not for: stable backdrops (→ primary; inverse produces near-zero contrast in one theme); warning saturated fill (→ persistent-black utility).\nGuaranteed AA: strong support fills (info/success/danger/neutral), dark neutral background. Scoped to TEXT_FILL.",
    tailwindClasses: ["text-neutral-inverse"],
    variable: "--color-text-neutral-inverse",
  },
  {
    description: "Anchor voice — headings, titles, data inside components (input values, table cells), menu/list items, active states. Not for: body copy/descriptions (→ secondary); form labels/helpers/captions (→ secondary); brand assertion (→ brand/primary); semantic states (→ support/*); flipping backdrops (→ inverse); interactive controls (component selects).\nGuaranteed AA: all 4 surfaces, neutral 00–03, all subtle + medium support. Scoped to TEXT_FILL.",
    tailwindClasses: ["text-neutral-primary"],
    variable: "--color-text-neutral-primary",
  },
  {
    description: "Body voice — body copy, form labels, helper text, captions, metadata. Not for: headings/titles/data values (→ primary); brand assertion (→ brand/primary); semantic states (→ support/*); flipping backdrops (→ inverse); interactive controls (component selects); NOT the empty-field prompt text (→ utility/placeholder/text, component-owned).\nGuaranteed AA: all 4 surfaces, neutral 00–03, subtle support. Not for medium support fills (primary covers those; secondary does not). Scoped to TEXT_FILL.",
    tailwindClasses: ["text-neutral-secondary"],
    variable: "--color-text-neutral-secondary",
  },
  {
    description: "Semantic text — danger charge, cues &quot;wrong&quot; before words are read. Not for: warnings that aren&#39;t errors; decorative emphasis; text on any danger-coloured fill (signal collapse — use neutral/inverse on danger fills).\nGuaranteed AA: all 4 surfaces, neutral 00–03, subtle support for other charges (NOT danger-subtle — semantic exclusion). Scoped to TEXT_FILL.",
    tailwindClasses: ["text-support-danger"],
    variable: "--color-text-support-danger",
  },
  {
    description: "Semantic text — info charge, cues &quot;for your information, no action required&quot;. Not for: main reading content (→ neutral/primary); error conditions (→ danger); text on any info-coloured fill (signal collapse — use neutral/inverse).\nGuaranteed AA: all 4 surfaces, neutral 00–01 (02–03 manual). Scoped to TEXT_FILL.",
    tailwindClasses: ["text-support-info"],
    variable: "--color-text-support-info",
  },
  {
    description: "Semantic text — success charge, cues &quot;this is done, this is right&quot;. Not for: main reading content (→ neutral/primary); error conditions (→ danger); text on any success-coloured fill (signal collapse — use neutral/inverse).\nGuaranteed AA: all 4 surfaces, neutral 00–02 (03 manual). Scoped to TEXT_FILL.",
    tailwindClasses: ["text-support-success"],
    variable: "--color-text-support-success",
  },
]

export const themeColors: {
  background: ColorData[]
  border: ColorData[]
  category: ColorData[]
  icon: ColorData[]
  surface: ColorData[]
  text: ColorData[]
} = {
  background,
  border,
  category,
  icon,
  surface,
  text,
}
