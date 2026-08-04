/* eslint-disable */
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/** This file was generated automatically. Do not edit it directly. */

export interface TokenWithComment {
  comment?: string
  name: string
  type?: string
  value: string | number
}

export const tokens: TokenWithComment[] = [
  {
    "comment": "Generously rounded corner. Value: 6px. A clearly curved corner — noticeably softer than md. Choose by how rounded the corner should read; between two steps, take the nearer. Never type the literal 6 — bind this variable. This group owns corner shape only; thickness → border/width/*, colour → color/border/*. Scoped to CORNER_RADIUS.",
    "name": "border-radius-lg",
    "type": "number",
    "value": "6px"
  },
  {
    "comment": "Moderately rounded corner. Value: 4px. A clearly softened turn — the everyday rounded corner. Choose by how rounded the corner should read. Caution: shares the value 4 with border/width/xl — pick by what the value is (a corner shape), never by the number. Never type the literal 4 — bind this variable. This group owns corner shape only; thickness → border/width/*, colour → color/border/*. Scoped to CORNER_RADIUS.",
    "name": "border-radius-md",
    "type": "number",
    "value": "4px"
  },
  {
    "comment": "Square sentinel — a deliberate hard right angle. Value: 0. A bound zero, NOT the absence of a token: this step says the corner is intentionally square, keeping the decision traceable and re-pointable. Bind this token for a square corner; never leave it untokenised or type 0 — a typed zero bypasses Core and loses the intent. Value coincides with a zero stroke width — pick by what the value is (a corner shape), never by the number. This group owns corner shape only — edge thickness → border/width/*, edge colour → color/border/*. Scoped to CORNER_RADIUS.",
    "name": "border-radius-none",
    "type": "number",
    "value": 0
  },
  {
    "comment": "Pill sentinel — always fully rounded into a capsule, whatever the element&#39;s size. Value: 360 (clamps to a full capsule at any size). Distinct from the largest graduated step (xxl): a graduated step gives a fixed corner that becomes proportionally less round as the element grows; rounded always clamps to a full capsule. Bind this token for a capsule; never type 360 — a typed number bypasses Core and won&#39;t behave as the capsule does when the element resizes. This group owns corner shape only; thickness → border/width/*, colour → color/border/*. Scoped to CORNER_RADIUS.",
    "name": "border-radius-rounded",
    "type": "number",
    "value": "360px"
  },
  {
    "comment": "Slightly softened corner. Value: 3px. A small rounding — perceptibly soft but still close to square. Choose by how rounded the corner should read; between two steps, take the nearer. Never type the literal 3 — bind this variable. This group owns corner shape only; thickness → border/width/*, colour → color/border/*. Scoped to CORNER_RADIUS.",
    "name": "border-radius-sm",
    "type": "number",
    "value": "3px"
  },
  {
    "comment": "Prominently rounded corner. Value: 8px. A strong rounding, clearly curved. Choose by how rounded the corner should read; between two steps, take the nearer. Never type the literal 8 — bind this variable. This group owns corner shape only; thickness → border/width/*, colour → color/border/*. Scoped to CORNER_RADIUS.",
    "name": "border-radius-xl",
    "type": "number",
    "value": "8px"
  },
  {
    "comment": "Barely softened corner. Value: 2px. The gentlest rounding on the graduated ladder — only just taking the sharpness off a square corner. Choose by how rounded the corner should read: sharper sits lower, softer sits higher. Between two steps, take the nearer. Never type the literal 2 — bind this variable. This group owns corner shape only; thickness → border/width/*, colour → color/border/*. Scoped to CORNER_RADIUS.",
    "name": "border-radius-xs",
    "type": "number",
    "value": "2px"
  },
  {
    "comment": "Very prominently rounded corner. Value: 12px. The largest graduated step — strongly curved, just below the fully-rounded capsule endpoint. If the intent is a corner that is always a full capsule regardless of element size, use border/radius/rounded instead — xxl gives a fixed radius that reads only partly round on a tall element. Never type the literal 12 — bind this variable. This group owns corner shape only. Scoped to CORNER_RADIUS.",
    "name": "border-radius-xxl",
    "type": "number",
    "value": "12px"
  },
  {
    "comment": "Substantial stroke. Value: 3px. A clearly assertive edge — heavier and more prominent than md. Choose by how prominent the edge should be; between two steps, take the nearer. Never type the literal 3 — bind this variable. No published component currently binds this step — part of the scale, not spare stock. This group owns stroke thickness only; corner shape → border/radius/*, colour → color/border/*. Scoped to STROKE_FLOAT.",
    "name": "border-width-lg",
    "type": "number",
    "value": "3px"
  },
  {
    "comment": "Clearly present stroke. Value: 2px. A firm, readable edge — clearly visible without being heavy. Choose by how prominent the edge should be; between two steps, take the nearer. Never type the literal 2 — bind this variable. No published component currently binds this step — part of the scale, not spare stock. This group owns stroke thickness only; corner shape → border/radius/*, colour → color/border/*. Scoped to STROKE_FLOAT.",
    "name": "border-width-md",
    "type": "number",
    "value": "2px"
  },
  {
    "comment": "No-stroke sentinel — a deliberately undrawn edge. Value: 0. A bound zero, NOT the absence of a token: this step says the edge has no stroke on purpose, keeping the decision traceable and re-pointable. Bind this token for an intentionally undrawn edge; never leave the stroke off without it — omitting a token loses the intent. Value coincides with border/radius/none (a square corner) — pick by what the value is (a stroke thickness), never by the number. This group owns stroke thickness only — corner shape → border/radius/*, edge colour → color/border/*. Scoped to STROKE_FLOAT.",
    "name": "border-width-none",
    "type": "number",
    "value": 0
  },
  {
    "comment": "Faint hairline stroke. Value: 1px. The lightest visible edge — barely-there, delineating without asserting. Choose by how prominent the edge should be: fainter sits lower, heavier sits higher. Between two steps, take the nearer. Never type the literal 1 — bind this variable. No published component currently binds this step — the ladder is the available set of thicknesses, not spare stock. This group owns stroke thickness only; corner shape → border/radius/*, colour → color/border/*. Scoped to STROKE_FLOAT.",
    "name": "border-width-sm",
    "type": "number",
    "value": "1px"
  },
  {
    "comment": "Heavy rule. Value: 4px. The heaviest stroke on the scale — a bold, dominant edge. Choose by how prominent the edge should be; between two steps, take the nearer. Caution: shares the value 4 with border/radius/md — pick by what the value is (a stroke thickness), never by the number. Never type the literal 4 — bind this variable. No published component currently binds this step — part of the scale, not spare stock. This group owns stroke thickness only; corner shape → border/radius/*, colour → color/border/*. Scoped to STROKE_FLOAT.",
    "name": "border-width-xl",
    "type": "number",
    "value": "4px"
  },
  {
    "name": "canvas-width",
    "type": "number",
    "value": 375
  },
  {
    "comment": "Strongest brand fill — most emphatic brand statement. No published component currently binds this. Not for: architectural layers (→ color/surface/*); status regions (→ support/*).\nForeground: inverse guaranteed (text/neutral/inverse, icon/neutral/inverse). Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-background-brand-primary-strong",
    "type": "color",
    "value": "#d3defa"
  },
  {
    "comment": "Quiet brand presence — light brand wash for regions that carry product identity at low prominence (tinted badges, brand-tinted panels). Not for: architectural layers (→ color/surface/*); status regions (→ support/*).\nForeground: dark/neutral guaranteed (text/neutral/primary, icon/neutral/primary, icon/brand/primary, support icons). Not inverse. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-background-brand-primary-subtle",
    "type": "color",
    "value": "#0f146f"
  },
  {
    "comment": "Saturated brand fill — unmistakably the brand. Published components bind this (e.g. badges). Not for: architectural layers (→ color/surface/*); status regions (→ support/*).\nForeground: NO group-level guarantee — component owns and proves its own foreground per brand × theme. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-background-brand-primary",
    "type": "color",
    "value": "#2d3ee0"
  },
  {
    "comment": "Lightest neutral separation — tonal distinction from the surface, no meaning beyond that. Use for panels, bands, control fills. Caution: same value as color/surface/primary — pick by role: region → this; architectural layer → surface/*. Not for status (→ support/*).\nForeground: dark/neutral guaranteed (text/neutral/primary, text/neutral/secondary, text/brand/primary, all support). Not inverse. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-background-neutral-00",
    "type": "color",
    "value": "#0a0a0a"
  },
  {
    "comment": "Second-lightest neutral separation. Use for panels, bands, control fills. Caution: same value as color/surface/secondary — pick by role: region → this; architectural layer → surface/*. Not for status (→ support/*).\nForeground: dark/neutral guaranteed. Not inverse. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-background-neutral-01",
    "type": "color",
    "value": "#19191a"
  },
  {
    "comment": "Third-rung neutral separation. Use for panels and bands needing more distinction from the surface. Caution: same value as support/neutral-subtle in some brands — pick by role: plain separation → this; neutral status → support/neutral-subtle. Not for status (→ support/*).\nForeground: dark/neutral guaranteed (most). Not inverse. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-background-neutral-02",
    "type": "color",
    "value": "#1f1f1f"
  },
  {
    "comment": "Highest neutral separation rung — most distinct while staying light. Not for status (→ support/*); not a step toward neutral/10 (that is a distinct inverse role).\nForeground: dark/neutral guaranteed (most). Not inverse. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-background-neutral-03",
    "type": "color",
    "value": "#242425"
  },
  {
    "comment": "Inverse neutral region — dark fill for light content (dark tooltips, dark badges). NOT a 4th rung of the separation ladder — a distinct inverse role. Not for: dark architectural layers (→ color/surface/*); status (→ support/*).\nForeground: inverse only (text/neutral/inverse, icon/neutral/inverse). Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-background-neutral-10",
    "type": "color",
    "value": "#ffffff"
  },
  {
    "comment": "Clearly present danger signal. Not for: plain separation (→ neutral/*). Never same-charge foreground — signal collapse.\nForeground: text/neutral/primary and icon/neutral/primary only. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-background-support-danger-medium",
    "type": "color",
    "value": "#7e0700"
  },
  {
    "comment": "Calm danger signal — lightest danger fill, for full-width danger alerts. Pick charge by meaning, strength by prominence. Not for: plain separation (→ neutral/*); non-danger states. Never same-charge foreground — signal collapse; use neutral foreground.\nForeground: dark/neutral guaranteed (text/neutral/primary, text/neutral/secondary, text/support/danger, support icons). Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-background-support-danger-subtle",
    "type": "color",
    "value": "#1e0000"
  },
  {
    "comment": "Loudest danger fill — small high-charge regions (status badges). Never same-charge foreground — signal collapse.\nForeground: inverse guaranteed (text/neutral/inverse, icon/neutral/inverse). Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-background-support-danger",
    "type": "color",
    "value": "#f1735e"
  },
  {
    "comment": "Clearly present info signal. Not for: plain separation (→ neutral/*). Never same-charge foreground — signal collapse.\nForeground: text/neutral/primary and icon/neutral/primary. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-background-support-info-medium",
    "type": "color",
    "value": "#283c97"
  },
  {
    "comment": "Calm info signal — lightest info fill, for full-width info alerts. Not for: plain separation (→ neutral/*); non-info states. Never same-charge foreground — signal collapse.\nForeground: dark/neutral guaranteed (text/neutral/primary, text/neutral/secondary, text/support/info, support icons). Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-background-support-info-subtle",
    "type": "color",
    "value": "#070d2a"
  },
  {
    "comment": "Loudest info fill — small high-charge regions (status badges). Never same-charge foreground — signal collapse.\nForeground: inverse guaranteed (text/neutral/inverse, icon/neutral/inverse). Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-background-support-info",
    "type": "color",
    "value": "#7697ff"
  },
  {
    "comment": "Clearly present grey status signal. No published component currently binds this. Never same-charge foreground — signal collapse.\nForeground: text/neutral/primary, icon/neutral/primary. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-background-support-neutral-medium",
    "type": "color",
    "value": "#636364"
  },
  {
    "comment": "Calm grey status signal — lightest neutral-status fill. Distinct from the neutral separation ladder (neutral/00–03), which has no status meaning. Caution: same value as neutral/02 in some brands — pick by role: plain separation → neutral/02; status → this. Never same-charge foreground — signal collapse.\nForeground: dark/neutral guaranteed (text/neutral/primary, text/neutral/secondary, support icons). Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-background-support-neutral-subtle",
    "type": "color",
    "value": "#1f1f1f"
  },
  {
    "comment": "Loudest grey status fill — dark fill for light content. Distinct from the neutral separation ladder. Never same-charge foreground — signal collapse.\nForeground: inverse guaranteed (text/neutral/inverse, icon/neutral/inverse). Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-background-support-neutral",
    "type": "color",
    "value": "#b9b9ba"
  },
  {
    "comment": "Clearly present success signal. Not for: plain separation (→ neutral/*). Never same-charge foreground — signal collapse.\nForeground: text/neutral/primary, icon/neutral/primary, icon/neutral/secondary. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-background-support-success-medium",
    "type": "color",
    "value": "#005a00"
  },
  {
    "comment": "Calm success signal — lightest success fill, for full-width success alerts. Not for: plain separation (→ neutral/*); non-success states. Never same-charge foreground — signal collapse.\nForeground: dark/neutral guaranteed (text/neutral/primary, text/neutral/secondary, text/support/success, support icons). Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-background-support-success-subtle",
    "type": "color",
    "value": "#001600"
  },
  {
    "comment": "Loudest success fill — small high-charge regions (status badges). Never same-charge foreground — signal collapse.\nForeground: inverse guaranteed (text/neutral/inverse, icon/neutral/inverse). Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-background-support-success",
    "type": "color",
    "value": "#5db655"
  },
  {
    "comment": "Clearly present warning signal. Not for: plain separation (→ neutral/*). Never same-charge foreground — signal collapse.\nForeground: text/neutral/primary, icon/neutral/primary, icon/neutral/secondary, icon/support/neutral. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-background-support-warning-medium",
    "type": "color",
    "value": "#5a4403"
  },
  {
    "comment": "Calm warning signal — lightest warning fill, for full-width warning alerts. Not for: plain separation (→ neutral/*); non-warning states. Never same-charge foreground — signal collapse.\nForeground: dark/neutral guaranteed (text/neutral/primary, text/neutral/secondary, text/brand/primary, support icons). Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-background-support-warning-subtle",
    "type": "color",
    "value": "#1e1500"
  },
  {
    "comment": "Loudest warning fill. Never same-charge foreground. WARNING EXCEPTION: persistent black foreground only — no neutral or inverse foreground clears this yellow across all brands × themes. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-background-support-warning",
    "type": "color",
    "value": "#ffc622"
  },
  {
    "comment": "Quieter brand edge — product identity at lower prominence. No published component currently binds this. Not for: structural-only edges (→ neutral family); state edges (→ support/*); fills. Contrast: verify 3:1 at point of use if the only state indicator. Scoped to STROKE_COLOR.",
    "name": "color-border-brand-primary-subtle",
    "type": "color",
    "value": "#0f146f"
  },
  {
    "comment": "Saturated brand edge — product identity, bound in published components (e.g. active-tab underline). Not for: structural-only edges (→ neutral family); state edges (→ support/*); fills. Contrast: verify 3:1 at point of use if the only state indicator. Scoped to STROKE_COLOR.",
    "name": "color-border-brand-primary",
    "type": "color",
    "value": "#7697ff"
  },
  {
    "comment": "Opaque light structural edge — lightest neutral boundary that holds a fixed colour. Use for card outlines, panel seams, input borders at rest. Not for: state edges (→ support/*); brand edges (→ brand/*); fills. Contrast: if the only visible boundary indicator, verify 3:1 at point of use (WCAG 1.4.11). Scoped to STROKE_COLOR.",
    "name": "color-border-neutral-00",
    "type": "color",
    "value": "#0a0a0a"
  },
  {
    "comment": "Translucent structural edge — faintest hairline; adapts to the surface beneath (grey on light, light on dark). Chain stops at Theme (opacity literal). Prefer over opaque where the edge must adapt across surfaces or themes. Not for: state edges (→ support/*); fills. Contrast: translucent — verify 3:1 against effective adjacent colour at point of use. Scoped to STROKE_COLOR.",
    "name": "color-border-neutral-01",
    "type": "color",
    "value": "#ffffff1a"
  },
  {
    "comment": "Translucent structural edge — mid-rung; more visible than 01, less assertive than 03; adapts to the surface beneath. Chain stops at Theme (opacity literal). Not for: state edges (→ support/*); fills. Contrast: verify 3:1 against effective adjacent colour at point of use. Scoped to STROKE_COLOR.",
    "name": "color-border-neutral-02",
    "type": "color",
    "value": "#ffffff33"
  },
  {
    "comment": "Translucent structural edge — firmest rung while still adapting to the surface beneath. Chain stops at Theme (opacity literal). Not for: state edges (→ support/*); fills. Contrast: verify 3:1 against effective adjacent colour at point of use. Scoped to STROKE_COLOR.",
    "name": "color-border-neutral-03",
    "type": "color",
    "value": "#ffffff4d"
  },
  {
    "comment": "Opaque dark (inverse) structural edge — fixed dark colour regardless of backdrop. Distinct role, NOT the continuation of the translucent ladder. Not for: state edges (→ support/*); brand edges; fills. Contrast: verify 3:1 at point of use. Scoped to STROKE_COLOR.",
    "name": "color-border-neutral-10",
    "type": "color",
    "value": "#ffffff"
  },
  {
    "comment": "Semantic edge — clearly present danger signal; the bound danger-charged edge in published components. Use for error outlines on failing fields, framed edge of danger alerts. Not for: structural separation (→ neutral family). Never on a danger-coloured fill (signal collapse). Contrast: 3:1 at point of use. Scoped to STROKE_COLOR.",
    "name": "color-border-support-danger-medium",
    "type": "color",
    "value": "#7e0700"
  },
  {
    "comment": "Semantic edge — loudest danger signal. No published component currently binds this bare strength. Not for: structural separation (→ neutral family); fills. Never on a danger-coloured fill (signal collapse). Contrast: 3:1 at point of use (WCAG 1.4.11). Scoped to STROKE_COLOR.",
    "name": "color-border-support-danger",
    "type": "color",
    "value": "#f1826f"
  },
  {
    "comment": "Semantic edge — clearly present info signal; the bound info-charged edge in published components. Use for framed edge of info alerts/notices. Never on an info-coloured fill (signal collapse). Contrast: 3:1 at point of use. Scoped to STROKE_COLOR.",
    "name": "color-border-support-info-medium",
    "type": "color",
    "value": "#283c97"
  },
  {
    "comment": "Semantic edge — loudest info signal. No published component currently binds this bare strength. Not for: structural separation; fills. Never on an info-coloured fill (signal collapse). Contrast: 3:1 at point of use. Scoped to STROKE_COLOR.",
    "name": "color-border-support-info",
    "type": "color",
    "value": "#82a1fe"
  },
  {
    "comment": "Semantic edge — clearly present grey status signal; the bound neutral-status-charged edge in published components. Distinct from the neutral separation family. Never on a neutral-status-coloured fill (signal collapse). Contrast: 3:1 at point of use. Scoped to STROKE_COLOR.",
    "name": "color-border-support-neutral-medium",
    "type": "color",
    "value": "#4f4f50"
  },
  {
    "comment": "Semantic edge — loudest grey status signal. Distinct from the neutral SEPARATION family (which marks structure with no meaning). No published component currently binds this bare strength. Never on a neutral-status-coloured fill (signal collapse). Contrast: 3:1 at point of use. Scoped to STROKE_COLOR.",
    "name": "color-border-support-neutral",
    "type": "color",
    "value": "#636364"
  },
  {
    "comment": "Semantic edge — clearly present success signal; the bound success-charged edge in published components. Use for framed edge of success alerts/notifications. Never on a success-coloured fill (signal collapse). Contrast: 3:1 at point of use. Scoped to STROKE_COLOR.",
    "name": "color-border-support-success-medium",
    "type": "color",
    "value": "#005a00"
  },
  {
    "comment": "Semantic edge — loudest success signal. No published component currently binds this bare strength. Never on a success-coloured fill (signal collapse). Contrast: 3:1 at point of use. Scoped to STROKE_COLOR.",
    "name": "color-border-support-success",
    "type": "color",
    "value": "#70bc68"
  },
  {
    "comment": "Semantic edge — clearly present warning signal; the bound warning-charged edge in published components. Use for framed edge of warning alerts. Never on a warning-coloured fill (signal collapse). Contrast: 3:1 at point of use. Scoped to STROKE_COLOR.",
    "name": "color-border-support-warning-medium",
    "type": "color",
    "value": "#5a4403"
  },
  {
    "comment": "Semantic edge — loudest warning signal. No published component currently binds this bare strength. Never on a warning-coloured fill (signal collapse). Contrast: 3:1 at point of use. Scoped to STROKE_COLOR.",
    "name": "color-border-support-warning",
    "type": "color",
    "value": "#d19d00"
  },
  {
    "comment": "Amber — medium strength. Distinguish set members — no meaning in the hue; assign by position and hold. Currently unbound by any published component. Not for: status (→ support/*); brand identity; implying rank.\nForeground: icon/neutral/primary guaranteed on all hues. Secondary/inverse NOT guaranteed. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-amber-medium",
    "type": "color",
    "value": "#773310"
  },
  {
    "comment": "Amber — strong (saturated). Distinguish set members. Badge uses strong tokens; strong tokens also appear as border bindings. Not for: status (→ support/*); brand identity; implying rank. Foreground is component-owned at this strength — check Guarantees before placing text on a strong fill.\nForeground: icon/neutral/primary and icon/neutral/inverse guaranteed. Text foregrounds are Manual — treat as component-owned for text. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-amber-strong",
    "type": "color",
    "value": "#a1480e"
  },
  {
    "comment": "Amber — subtle (light fill). Distinguish set members — no meaning in the hue; assign by position and hold across all views. Badge uses subtle tokens. Not for: status (→ support/*); brand identity (→ brand/*); implying rank.\nForeground: text/neutral/primary and icon/neutral/primary guaranteed. text/neutral/secondary NOT guaranteed (manual). Multi-scope: match to the property (fill/text/stroke). Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-amber-subtle",
    "type": "color",
    "value": "#4e1e06"
  },
  {
    "comment": "Blue — medium strength. Distinguish set members — no meaning in the hue; assign by position and hold. Currently unbound by any published component. Not for: status (→ support/*); brand identity; implying rank.\nForeground: icon/neutral/primary guaranteed on all hues. Secondary/inverse NOT guaranteed. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-blue-medium",
    "type": "color",
    "value": "#034ad9"
  },
  {
    "comment": "Blue — strong (saturated). Distinguish set members. Badge uses strong tokens; strong tokens also appear as border bindings. Not for: status (→ support/*); brand identity; implying rank. Foreground is component-owned at this strength — check Guarantees before placing text on a strong fill.\nForeground: icon/neutral/primary and icon/neutral/inverse guaranteed. Text foregrounds are Manual — treat as component-owned for text. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-blue-strong",
    "type": "color",
    "value": "#1669fe"
  },
  {
    "comment": "Blue — subtle (light fill). Distinguish set members — no meaning in the hue; assign by position and hold across all views. Badge uses subtle tokens. Not for: status (→ support/*); brand identity (→ brand/*); implying rank.\nForeground: text/neutral/primary and icon/neutral/primary guaranteed. text/neutral/secondary NOT guaranteed (manual). Multi-scope: match to the property (fill/text/stroke). Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-blue-subtle",
    "type": "color",
    "value": "#01278a"
  },
  {
    "comment": "Cyan — medium strength. Distinguish set members — no meaning in the hue; assign by position and hold. Currently unbound by any published component. Not for: status (→ support/*); brand identity; implying rank.\nForeground: icon/neutral/primary guaranteed on all hues. Secondary/inverse NOT guaranteed. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-cyan-medium",
    "type": "color",
    "value": "#005aa3"
  },
  {
    "comment": "Cyan — strong (saturated). Distinguish set members. Badge uses strong tokens; strong tokens also appear as border bindings. Not for: status (→ support/*); brand identity; implying rank. Foreground is component-owned at this strength — check Guarantees before placing text on a strong fill.\nForeground: icon/neutral/primary and icon/neutral/inverse guaranteed. Text foregrounds are Manual — treat as component-owned for text. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-cyan-strong",
    "type": "color",
    "value": "#0377c9"
  },
  {
    "comment": "Cyan — subtle (light fill). Distinguish set members — no meaning in the hue; assign by position and hold across all views. Badge uses subtle tokens. Not for: status (→ support/*); brand identity (→ brand/*); implying rank.\nForeground: text/neutral/primary and icon/neutral/primary guaranteed. text/neutral/secondary NOT guaranteed (manual). Multi-scope: match to the property (fill/text/stroke). Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-cyan-subtle",
    "type": "color",
    "value": "#013360"
  },
  {
    "comment": "Green — medium strength. Distinguish set members — no meaning in the hue; assign by position and hold. Currently unbound by any published component. Proximity: avoid adjacent to success indicators. Not for: status (→ support/*); brand identity; implying rank.\nForeground: icon/neutral/primary guaranteed on all hues. Secondary/inverse NOT guaranteed. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-green-medium",
    "type": "color",
    "value": "#207552"
  },
  {
    "comment": "Green — strong (saturated). Distinguish set members. Badge uses strong tokens; strong tokens also appear as border bindings. Proximity: avoid adjacent to success indicators. Not for: status (→ support/*); brand identity; implying rank. Foreground is component-owned at this strength — check Guarantees before placing text on a strong fill.\nForeground: No foreground guaranteed at green/strong — all Manual. Verify every pairing or let the component own it. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-green-strong",
    "type": "color",
    "value": "#1f845a"
  },
  {
    "comment": "Green — subtle (light fill). Distinguish set members — no meaning in the hue; assign by position and hold across all views. Badge uses subtle tokens. Proximity: avoid adjacent to success indicators. Not for: status (→ support/*); brand identity (→ brand/*); implying rank.\nForeground: text/neutral/primary and icon/neutral/primary guaranteed. text/neutral/secondary NOT guaranteed (manual). Multi-scope: match to the property (fill/text/stroke). Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-green-subtle",
    "type": "color",
    "value": "#185039"
  },
  {
    "comment": "Lime — medium strength. Distinguish set members — no meaning in the hue; assign by position and hold. Currently unbound by any published component. Not for: status (→ support/*); brand identity; implying rank.\nForeground: icon/neutral/primary guaranteed on all hues. Secondary/inverse NOT guaranteed. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-lime-medium",
    "type": "color",
    "value": "#517121"
  },
  {
    "comment": "Lime — strong (saturated). Distinguish set members. Badge uses strong tokens; strong tokens also appear as border bindings. Not for: status (→ support/*); brand identity; implying rank. Foreground is component-owned at this strength — check Guarantees before placing text on a strong fill.\nForeground: No foreground guaranteed at lime/strong — all Manual. Verify every pairing or let the component own it. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-lime-strong",
    "type": "color",
    "value": "#5b7f24"
  },
  {
    "comment": "Lime — subtle (light fill). Distinguish set members — no meaning in the hue; assign by position and hold across all views. Badge uses subtle tokens. Not for: status (→ support/*); brand identity (→ brand/*); implying rank.\nForeground: text/neutral/primary and icon/neutral/primary guaranteed. text/neutral/secondary NOT guaranteed (manual). Multi-scope: match to the property (fill/text/stroke). Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-lime-subtle",
    "type": "color",
    "value": "#3a4d1f"
  },
  {
    "comment": "Magenta — medium strength. Distinguish set members — no meaning in the hue; assign by position and hold. Currently unbound by any published component. Not for: status (→ support/*); brand identity; implying rank.\nForeground: icon/neutral/primary guaranteed on all hues. Secondary/inverse NOT guaranteed. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-magenta-medium",
    "type": "color",
    "value": "#aa1b59"
  },
  {
    "comment": "Magenta — strong (saturated). Distinguish set members. Badge uses strong tokens; strong tokens also appear as border bindings. Not for: status (→ support/*); brand identity; implying rank. Foreground is component-owned at this strength — check Guarantees before placing text on a strong fill.\nForeground: No foreground guaranteed at magenta/strong — all Manual. Verify every pairing or let the component own it. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-magenta-strong",
    "type": "color",
    "value": "#d52d76"
  },
  {
    "comment": "Magenta — subtle (light fill). Distinguish set members — no meaning in the hue; assign by position and hold across all views. Badge uses subtle tokens. Not for: status (→ support/*); brand identity (→ brand/*); implying rank.\nForeground: text/neutral/primary and icon/neutral/primary guaranteed. text/neutral/secondary NOT guaranteed (manual). Multi-scope: match to the property (fill/text/stroke). Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-magenta-subtle",
    "type": "color",
    "value": "#670630"
  },
  {
    "comment": "Orange — medium strength. Distinguish set members — no meaning in the hue; assign by position and hold. Currently unbound by any published component. Not for: status (→ support/*); brand identity; implying rank.\nForeground: icon/neutral/primary guaranteed on all hues. Secondary/inverse NOT guaranteed. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-orange-medium",
    "type": "color",
    "value": "#953d00"
  },
  {
    "comment": "Orange — strong (saturated). Distinguish set members. Badge uses strong tokens; strong tokens also appear as border bindings. Not for: status (→ support/*); brand identity; implying rank. Foreground is component-owned at this strength — check Guarantees before placing text on a strong fill.\nForeground: icon/neutral/primary and icon/neutral/inverse guaranteed. Text foregrounds are Manual — treat as component-owned for text. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-orange-strong",
    "type": "color",
    "value": "#c25100"
  },
  {
    "comment": "Orange — subtle (light fill). Distinguish set members — no meaning in the hue; assign by position and hold across all views. Badge uses subtle tokens. Not for: status (→ support/*); brand identity (→ brand/*); implying rank.\nForeground: text/neutral/primary and icon/neutral/primary guaranteed. text/neutral/secondary NOT guaranteed (manual). Multi-scope: match to the property (fill/text/stroke). Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-orange-subtle",
    "type": "color",
    "value": "#522301"
  },
  {
    "comment": "Purple — medium strength. Distinguish set members — no meaning in the hue; assign by position and hold. Currently unbound by any published component. Not for: status (→ support/*); brand identity; implying rank.\nForeground: icon/neutral/primary guaranteed on all hues. Secondary/inverse NOT guaranteed. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-purple-medium",
    "type": "color",
    "value": "#712ed1"
  },
  {
    "comment": "Purple — strong (saturated). Distinguish set members. Badge uses strong tokens; strong tokens also appear as border bindings. Not for: status (→ support/*); brand identity; implying rank. Foreground is component-owned at this strength — check Guarantees before placing text on a strong fill.\nForeground: No foreground guaranteed at purple/strong — all Manual. Verify every pairing or let the component own it. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-purple-strong",
    "type": "color",
    "value": "#8f46fc"
  },
  {
    "comment": "Purple — subtle (light fill). Distinguish set members — no meaning in the hue; assign by position and hold across all views. Badge uses subtle tokens. Not for: status (→ support/*); brand identity (→ brand/*); implying rank.\nForeground: text/neutral/primary and icon/neutral/primary guaranteed. text/neutral/secondary NOT guaranteed (manual). Multi-scope: match to the property (fill/text/stroke). Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-purple-subtle",
    "type": "color",
    "value": "#40197a"
  },
  {
    "comment": "Red — medium strength. Distinguish set members — no meaning in the hue; assign by position and hold. Currently unbound by any published component. Proximity: avoid adjacent to danger indicators. Not for: status (→ support/*); brand identity; implying rank.\nForeground: icon/neutral/primary guaranteed on all hues. Secondary/inverse NOT guaranteed. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-red-medium",
    "type": "color",
    "value": "#af1a21"
  },
  {
    "comment": "Red — strong (saturated). Distinguish set members. Badge uses strong tokens; strong tokens also appear as border bindings. Proximity: avoid adjacent to danger indicators. Not for: status (→ support/*); brand identity; implying rank. Foreground is component-owned at this strength — check Guarantees before placing text on a strong fill.\nForeground: icon/neutral/primary and icon/neutral/inverse guaranteed. Text foregrounds are Manual — treat as component-owned for text. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-red-strong",
    "type": "color",
    "value": "#df252f"
  },
  {
    "comment": "Red — subtle (light fill). Distinguish set members — no meaning in the hue; assign by position and hold across all views. Badge uses subtle tokens. Proximity: avoid adjacent to danger indicators. Not for: status (→ support/*); brand identity (→ brand/*); implying rank.\nForeground: text/neutral/primary and icon/neutral/primary guaranteed. text/neutral/secondary NOT guaranteed (manual). Multi-scope: match to the property (fill/text/stroke). Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-red-subtle",
    "type": "color",
    "value": "#680a0f"
  },
  {
    "comment": "Teal — medium strength. Distinguish set members — no meaning in the hue; assign by position and hold. Currently unbound by any published component. Not for: status (→ support/*); brand identity; implying rank.\nForeground: icon/neutral/primary guaranteed on all hues. Secondary/inverse NOT guaranteed. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-teal-medium",
    "type": "color",
    "value": "#006563"
  },
  {
    "comment": "Teal — strong (saturated). Distinguish set members. Badge uses strong tokens; strong tokens also appear as border bindings. Not for: status (→ support/*); brand identity; implying rank. Foreground is component-owned at this strength — check Guarantees before placing text on a strong fill.\nForeground: icon/neutral/primary and icon/neutral/inverse guaranteed. Text foregrounds are Manual — treat as component-owned for text. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-teal-strong",
    "type": "color",
    "value": "#02827e"
  },
  {
    "comment": "Teal — subtle (light fill). Distinguish set members — no meaning in the hue; assign by position and hold across all views. Badge uses subtle tokens. Not for: status (→ support/*); brand identity (→ brand/*); implying rank.\nForeground: text/neutral/primary and icon/neutral/primary guaranteed. text/neutral/secondary NOT guaranteed (manual). Multi-scope: match to the property (fill/text/stroke). Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-teal-subtle",
    "type": "color",
    "value": "#01393c"
  },
  {
    "comment": "Violet — medium strength. Distinguish set members — no meaning in the hue; assign by position and hold. Currently unbound by any published component. Not for: status (→ support/*); brand identity; implying rank.\nForeground: icon/neutral/primary guaranteed on all hues. Secondary/inverse NOT guaranteed. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-violet-medium",
    "type": "color",
    "value": "#701b85"
  },
  {
    "comment": "Violet — strong (saturated). Distinguish set members. Badge uses strong tokens; strong tokens also appear as border bindings. Not for: status (→ support/*); brand identity; implying rank. Foreground is component-owned at this strength — check Guarantees before placing text on a strong fill.\nForeground: icon/neutral/primary and icon/neutral/inverse guaranteed. Text foregrounds are Manual — treat as component-owned for text. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-violet-strong",
    "type": "color",
    "value": "#9521b9"
  },
  {
    "comment": "Violet — subtle (light fill). Distinguish set members — no meaning in the hue; assign by position and hold across all views. Badge uses subtle tokens. Not for: status (→ support/*); brand identity (→ brand/*); implying rank.\nForeground: text/neutral/primary and icon/neutral/primary guaranteed. text/neutral/secondary NOT guaranteed (manual). Multi-scope: match to the property (fill/text/stroke). Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-violet-subtle",
    "type": "color",
    "value": "#480b57"
  },
  {
    "comment": "Yellow — medium strength. Distinguish set members — no meaning in the hue; assign by position and hold. Currently unbound by any published component. Proximity: avoid adjacent to warning indicators. Not for: status (→ support/*); brand identity; implying rank.\nForeground: icon/neutral/primary guaranteed on all hues. EXCEPTION: text/neutral/primary is Manual only at yellow/medium. Secondary/inverse NOT guaranteed. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-yellow-medium",
    "type": "color",
    "value": "#9a7402"
  },
  {
    "comment": "Yellow — strong (saturated). Distinguish set members. Badge uses strong tokens; strong tokens also appear as border bindings. Proximity: avoid adjacent to warning indicators. Not for: status (→ support/*); brand identity; implying rank. Foreground is component-owned at this strength — check Guarantees before placing text on a strong fill.\nForeground: YELLOW EXCEPTION: no foreground guaranteed — everything Manual across brands × themes. Verify every placement or let the component own the pairing. Multi-scope: match to the property. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-yellow-strong",
    "type": "color",
    "value": "#efbf1a"
  },
  {
    "comment": "Yellow — subtle (light fill). Distinguish set members — no meaning in the hue; assign by position and hold across all views. Badge uses subtle tokens. Proximity: avoid adjacent to warning indicators. Not for: status (→ support/*); brand identity (→ brand/*); implying rank.\nForeground: text/neutral/primary and icon/neutral/primary guaranteed. text/neutral/secondary NOT guaranteed (manual). Multi-scope: match to the property (fill/text/stroke). Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-category-yellow-subtle",
    "type": "color",
    "value": "#684e01"
  },
  {
    "comment": "Brand-coloured icon — product-identity glyph, standalone. Not for: plain affordances (→ neutral family; brand is identity, not a generic accent); status glyphs (→ support/*); in-control glyphs (component owns).\nGuaranteed 3:1: all 4 surfaces, light neutral ladder, subtle support + subtle categorical. Manual on categorical-medium/strong. Not on strong same-charge support. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-icon-brand-primary",
    "type": "color",
    "value": "#7697ff"
  },
  {
    "comment": "Neutral icon voice on flipping backdrops — saturated fills, dark neutral background. Not a &quot;white icon&quot;. Prefer over mode override for flipping backdrops. Not for: stable backdrops (→ neutral/primary; inverse near-zero contrast in one theme).\nGuaranteed 3:1: dark neutral, strong brand, saturated same-charge support (danger/info/success/neutral). Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-icon-neutral-inverse",
    "type": "color",
    "value": "#0a0a0a"
  },
  {
    "comment": "Neutral icon at full strength — standalone glyphs (category symbols, chevrons, marks beside labels). Not for: icons inside interactive controls (component owns — test is per-brand component/* tokens, NOT fill); charged glyphs (→ support/*); brand glyphs (→ brand/primary).\nGuaranteed 3:1: all 4 surfaces, light neutral ladder, subtle/medium support + categorical. Not on dark neutral or strong fills. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-icon-neutral-primary",
    "type": "color",
    "value": "#ffffff"
  },
  {
    "comment": "Neutral icon, quieter — supporting glyphs alongside secondary content. Not for: load-bearing glyphs (→ neutral/primary); in-control glyphs (component owns).\nGuaranteed 3:1: all 4 surfaces, light neutral ladder, subtle support + subtle categorical. Manual on categorical-medium, dark neutral. Not on strong fills. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-icon-neutral-secondary",
    "type": "color",
    "value": "#aaaaab"
  },
  {
    "comment": "Semantic icon — danger charge, cues &quot;wrong&quot;. Not for: decorative use (drains signal); plain marking (→ neutral family); in-control glyphs. Never on danger-coloured fill (signal collapse — use neutral/inverse).\nGuaranteed 3:1: all 4 surfaces, lighter neutral + subtle support. Not on same-charge fill. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-icon-support-danger",
    "type": "color",
    "value": "#f1735e"
  },
  {
    "comment": "Semantic icon — info charge. Not for: decorative use; plain marking (→ neutral family); in-control glyphs. Never on info-coloured fill (signal collapse).\nGuaranteed 3:1: all 4 surfaces and lighter backgrounds. Not on same-charge fill. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-icon-support-info",
    "type": "color",
    "value": "#7697ff"
  },
  {
    "comment": "Semantic icon — grey status charge (distinct from the neutral icon FAMILY, which does plain unmarked marking). Not for: plain marking (→ neutral/primary or secondary — &quot;neutral&quot; means different things in these two families); in-control glyphs. Never on neutral-status-coloured fill (signal collapse).\nGuaranteed 3:1: all 4 surfaces and lighter backgrounds. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-icon-support-neutral",
    "type": "color",
    "value": "#949495"
  },
  {
    "comment": "Semantic icon — success charge. Not for: decorative use; plain marking (→ neutral family); in-control glyphs. Never on success-coloured fill (signal collapse).\nGuaranteed 3:1: all 4 surfaces and lighter backgrounds. Not on same-charge fill. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-icon-support-success",
    "type": "color",
    "value": "#49b140"
  },
  {
    "comment": "Semantic icon — warning charge (&quot;proceed carefully&quot;, not &quot;wrong&quot;). Not for: error conditions (→ danger); decorative use; in-control glyphs. Never on warning-coloured fill.\nCONTRAST WARNING: low-luminance yellow — Manual across nearly every backdrop. Verify per brand × theme for every placement. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-icon-support-warning",
    "type": "color",
    "value": "#fabb00"
  },
  {
    "comment": "Danger — fill of a destructive-action interactive control at hover. Take the whole state set (idle/hover/pressed) together. Foreground: component-owned. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-danger-hover",
    "type": "color",
    "value": "#be0000"
  },
  {
    "comment": "Danger — fill of a destructive-action or error-carrying interactive control at idle. Always take the whole state set (idle/hover/pressed) together. Not for static content (→ color/background/*) or disabled (→ color/utility/disabled/*). Foreground: component-owned for all danger fills. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-danger-idle",
    "type": "color",
    "value": "#a50000"
  },
  {
    "comment": "Danger — fill of a destructive-action interactive control at pressed. Take the whole state set together. Foreground: icon/neutral/inverse is guaranteed against the pressed danger fill — the one group-level guarantee; all others are Manual. Component owns its foreground. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-danger-pressed",
    "type": "color",
    "value": "#d02107"
  },
  {
    "comment": "Ghost — fill of a ghost-voice interactive control at hover. The translucent fill appearing when the pointer is over the control. Translucent (opacity literal). No measured foreground — composes over the surface beneath. Take the whole state set together. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-ghost-hover",
    "type": "color",
    "value": "#ffffff14"
  },
  {
    "comment": "Ghost — fill of a ghost-voice interactive control at idle. Ghost has no resting fill — this token is transparent at idle. Translucent (held at Theme as an opacity literal). No measured foreground — the ghost fill composes over the surface beneath; contrast is set by that surface. Take the whole state set (idle/hover/pressed) together. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-ghost-idle",
    "type": "color",
    "value": "#ffffff00"
  },
  {
    "comment": "Ghost — fill of a ghost-voice interactive control at pressed. Translucent (opacity literal). No measured foreground — composes over the surface beneath. Take the whole state set together. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-ghost-pressed",
    "type": "color",
    "value": "#ffffff29"
  },
  {
    "comment": "Inverse — solid fill of an inverse-voice control at hover. On a backdrop whose tonal value flips across themes. Foreground: broad guaranteed set at hover — icon/neutral/primary, icon/neutral/secondary, icon/brand/primary, text/neutral/primary, text/neutral/secondary, support icons and danger text (see Guarantees). Not inverse. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-inverse-fill-hover",
    "type": "color",
    "value": "#242425"
  },
  {
    "comment": "Inverse — solid fill of an inverse-voice control at idle. For a control on a backdrop whose tonal value flips across themes; the fill flips with it. Prefer the inverse charge over a per-instance mode override when the need is a flipping backdrop. Take the whole state set together. Foreground: broad guaranteed set at idle — icon/brand/primary, icon/neutral/primary, icon/neutral/secondary, all support icons, text/neutral/primary, text/neutral/secondary, most support texts (see Guarantees). Not inverse. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-inverse-fill-idle",
    "type": "color",
    "value": "#0a0a0a"
  },
  {
    "comment": "Inverse — solid fill of an inverse-voice control at pressed. On a flipping backdrop. Foreground: guaranteed icon/brand/primary, icon/neutral/primary, icon/neutral/secondary, most support icons, text/neutral/primary — see Guarantees for full list; secondary text and most support texts are Manual at pressed. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-inverse-fill-pressed",
    "type": "color",
    "value": "#3c3c3d"
  },
  {
    "comment": "Inverse ghost — translucent fill of an inverse-voice ghost-form control at hover on a flipping backdrop. No measured foreground — composes over the surface beneath. Take the whole state set together. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-inverse-ghost-hover",
    "type": "color",
    "value": "#00000014"
  },
  {
    "comment": "Inverse ghost — fill of an inverse-voice ghost-form control at idle. Transparent at rest on a backdrop whose tonal value flips across themes. Translucent (opacity literal). No measured foreground — composes over the flipping surface beneath. Take the whole state set together. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-inverse-ghost-idle",
    "type": "color",
    "value": "#00000000"
  },
  {
    "comment": "Inverse ghost — translucent fill of an inverse-voice ghost-form control at pressed on a flipping backdrop. No measured foreground. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-inverse-ghost-pressed",
    "type": "color",
    "value": "#00000029"
  },
  {
    "comment": "Neutral — fill of a neutral-voice interactive control at hover. Take the whole state set (idle/hover/pressed) together. Foreground: component-owned. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-neutral-hover",
    "type": "color",
    "value": "#6a6a6b"
  },
  {
    "comment": "Neutral — fill of a neutral-voice interactive control at idle. Quiet, unkeyed non-primary action. Always take the whole state set (idle/hover/pressed) together. Not for static content (→ color/background/*) or disabled (→ color/utility/disabled/*). Foreground: component-owned. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-neutral-idle",
    "type": "color",
    "value": "#5c5c5d"
  },
  {
    "comment": "Neutral — fill of a neutral-voice interactive control at pressed. Take the whole state set together. Foreground: component-owned. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-neutral-pressed",
    "type": "color",
    "value": "#717171"
  },
  {
    "comment": "Persistent/black — solid fill at hover. On a light-stable backdrop; value fixed black in both themes. Foreground: only icon/support/warning is guaranteed; all other foregrounds are Manual — component-owned. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-persistent-black-fill-hover",
    "type": "color",
    "value": "#242425"
  },
  {
    "comment": "Persistent/black — solid fill of a persistent-black-voice control at idle. For a control on a light-stable backdrop — value is fixed black in both themes. Take the whole state set together. Foreground: the one exception in the group — icon/neutral/secondary and all support icons (danger/info/neutral/success/warning) are guaranteed in every brand × theme; all text pairings and icon/neutral/primary are Manual. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-persistent-black-fill-idle",
    "type": "color",
    "value": "#0a0a0a"
  },
  {
    "comment": "Persistent/black — solid fill at pressed. On a light-stable backdrop; value fixed black in both themes. Foreground: only icon/support/warning is guaranteed; all other foregrounds are Manual or Not — component-owned. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-persistent-black-fill-pressed",
    "type": "color",
    "value": "#3c3c3d"
  },
  {
    "comment": "Persistent/black ghost — translucent fill at hover on a light-stable backdrop. No measured foreground. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-persistent-black-ghost-hover",
    "type": "color",
    "value": "#00000014"
  },
  {
    "comment": "Persistent/black ghost — fill of a persistent-black-voice ghost-form control at idle. Transparent at rest on a light-stable backdrop. Translucent (opacity literal). No measured foreground — composes over the backdrop. Take the whole state set together. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-persistent-black-ghost-idle",
    "type": "color",
    "value": "#00000000"
  },
  {
    "comment": "Persistent/black ghost — translucent fill at pressed on a light-stable backdrop. No measured foreground. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-persistent-black-ghost-pressed",
    "type": "color",
    "value": "#00000029"
  },
  {
    "comment": "Persistent/white — solid fill at hover. On a dark-stable backdrop; value fixed white in both themes. Foreground: component-owned. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-persistent-white-fill-hover",
    "type": "color",
    "value": "#e7e7e8"
  },
  {
    "comment": "Persistent/white — solid fill of a persistent-white-voice control at idle. For a control on a dark-stable backdrop (value stable across themes) — value is fixed white in both themes. Take the whole state set together. Foreground: component-owned for all persistent/white fills — no group-level guaranteed foreground; consuming component owns and proves its own foreground. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-persistent-white-fill-idle",
    "type": "color",
    "value": "#ffffff"
  },
  {
    "comment": "Persistent/white — solid fill at pressed. On a dark-stable backdrop; value fixed white in both themes. Foreground: component-owned. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-persistent-white-fill-pressed",
    "type": "color",
    "value": "#d0d0d1"
  },
  {
    "comment": "Persistent/white ghost — translucent fill at hover on a dark-stable backdrop. No measured foreground. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-persistent-white-ghost-hover",
    "type": "color",
    "value": "#ffffff14"
  },
  {
    "comment": "Persistent/white ghost — fill of a persistent-white-voice ghost-form control at idle. Transparent at rest on a dark-stable backdrop. Translucent (opacity literal). No measured foreground — composes over the backdrop. Take the whole state set together. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-persistent-white-ghost-idle",
    "type": "color",
    "value": "#ffffff00"
  },
  {
    "comment": "Persistent/white ghost — translucent fill at pressed on a dark-stable backdrop. No measured foreground. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-persistent-white-ghost-pressed",
    "type": "color",
    "value": "#ffffff29"
  },
  {
    "comment": "Primary — fill of a primary-voice interactive control at hover (pointer over the control). Take the whole state set (idle/hover/pressed) together. Foreground: component-owned; no group-level guarantee. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-primary-hover",
    "type": "color",
    "value": "#3850f1"
  },
  {
    "comment": "Primary — fill of a primary-voice interactive control at idle. Main action, brand-keyed. Always take the whole state set (idle/hover/pressed) together — never bind one state and hand-author the others. Not for static content (→ color/background/*) or disabled (→ color/utility/disabled/*). Foreground: component-owned for all primary fills; the saturated fill shifts across brands/themes — the consuming component owns and proves its own foreground. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-primary-idle",
    "type": "color",
    "value": "#2d3ee0"
  },
  {
    "comment": "Primary — fill of a primary-voice interactive control at pressed (being activated). Take the whole state set together. Foreground: icon/neutral/inverse is guaranteed against the pressed primary fill in every brand × theme — the one group-level guarantee; all other foregrounds are Manual. Component owns its foreground. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-interactive-background-primary-pressed",
    "type": "color",
    "value": "#3d59fa"
  },
  {
    "comment": "Danger — error or destructive-action outline at hover. Opaque. Take the whole state set together. Contrast: verify 3:1 at point of use if the only state indicator. Scoped to STROKE_COLOR.",
    "name": "color-interactive-border-danger-hover",
    "type": "color",
    "value": "#f0907f"
  },
  {
    "comment": "Danger — the error or destructive-action outline of a danger-voice interactive control at idle. Opaque. Always take the whole state set (idle/hover/pressed) together. Not for static semantic edges (→ color/border/support/danger*). Contrast: if the only visible state indicator, verify 3:1 against adjacent colours at point of use (WCAG 1.4.11). Scoped to STROKE_COLOR.",
    "name": "color-interactive-border-danger-idle",
    "type": "color",
    "value": "#f1735e"
  },
  {
    "comment": "Danger — error or destructive-action outline at pressed. Opaque. Take the whole state set together. Contrast: verify 3:1 at point of use if the only state indicator. Scoped to STROKE_COLOR.",
    "name": "color-interactive-border-danger-pressed",
    "type": "color",
    "value": "#febbae"
  },
  {
    "comment": "Inverse — edge of an inverse-voice control at hover. On a flipping backdrop. Translucent (opacity literal). Take the whole state set together. Contrast: verify 3:1 against effective adjacent colour at point of use. Scoped to STROKE_COLOR.",
    "name": "color-interactive-border-inverse-hover",
    "type": "color",
    "value": "#000000e5"
  },
  {
    "comment": "Inverse — edge of an inverse-voice interactive control at idle. For a control on a backdrop whose tonal value flips across themes. Translucent (held at Theme as an opacity literal; effective colour from what it sits over). Take the whole state set (idle/hover/pressed) together. Prefer the inverse charge over a per-instance mode override. Contrast: translucent — verify 3:1 against effective adjacent colour at point of use (WCAG 1.4.11). Scoped to STROKE_COLOR.",
    "name": "color-interactive-border-inverse-idle",
    "type": "color",
    "value": "#000000cc"
  },
  {
    "comment": "Inverse — edge of an inverse-voice control at pressed. On a flipping backdrop. Opaque at pressed (resolves to a primitive). Take the whole state set together. Contrast: verify 3:1 against adjacent colours at point of use. Scoped to STROKE_COLOR.",
    "name": "color-interactive-border-inverse-pressed",
    "type": "color",
    "value": "#0a0a0a"
  },
  {
    "comment": "Neutral — edge of a neutral-voice outlined control or input at hover. Translucent (opacity literal; effective colour from what it sits over). Take the whole state set together. Contrast: verify 3:1 against effective adjacent colour at point of use. Scoped to STROKE_COLOR.",
    "name": "color-interactive-border-neutral-hover",
    "type": "color",
    "value": "#ffffff6b"
  },
  {
    "comment": "Neutral — edge of a neutral-voice outlined interactive control or input at idle. Translucent (held at Theme as an opacity literal; effective colour comes from what it sits over). Always take the whole state set (idle/hover/pressed) together. Not for static edges (→ color/border/*). Contrast: translucent — verify 3:1 against the EFFECTIVE adjacent colour at point of use if the only state indicator (WCAG 1.4.11). Scoped to STROKE_COLOR.",
    "name": "color-interactive-border-neutral-idle",
    "type": "color",
    "value": "#ffffff4d"
  },
  {
    "comment": "Neutral — edge of a neutral-voice outlined control or input at pressed. Translucent (opacity literal). Take the whole state set together. Contrast: verify 3:1 against effective adjacent colour at point of use. Scoped to STROKE_COLOR.",
    "name": "color-interactive-border-neutral-pressed",
    "type": "color",
    "value": "#ffffff8a"
  },
  {
    "comment": "Persistent/black — edge at hover. On a light-stable backdrop. Translucent (opacity literal). Take the whole state set together. Contrast: verify 3:1 against effective adjacent colour at point of use. Scoped to STROKE_COLOR.",
    "name": "color-interactive-border-persistent-black-hover",
    "type": "color",
    "value": "#000000e5"
  },
  {
    "comment": "Persistent/black — edge of a persistent-black-voice control at idle. On a light-stable backdrop; value is fixed black in both themes. Translucent (held at Theme as an opacity literal; effective colour from what it sits over). Take the whole state set (idle/hover/pressed) together. Contrast: translucent — verify 3:1 against effective adjacent colour at point of use (WCAG 1.4.11). Scoped to STROKE_COLOR.",
    "name": "color-interactive-border-persistent-black-idle",
    "type": "color",
    "value": "#000000cc"
  },
  {
    "comment": "Persistent/black — edge at pressed. On a light-stable backdrop. Opaque at pressed (resolves to a primitive). Take the whole state set together. Contrast: verify 3:1 against adjacent colours at point of use. Scoped to STROKE_COLOR.",
    "name": "color-interactive-border-persistent-black-pressed",
    "type": "color",
    "value": "#0a0a0a"
  },
  {
    "comment": "Persistent/white — edge at hover. On a dark-stable backdrop. Translucent (opacity literal). Take the whole state set together. Contrast: verify 3:1 against effective adjacent colour at point of use. Scoped to STROKE_COLOR.",
    "name": "color-interactive-border-persistent-white-hover",
    "type": "color",
    "value": "#ffffffe5"
  },
  {
    "comment": "Persistent/white — edge of a persistent-white-voice control at idle. On a dark-stable backdrop; value is fixed white in both themes. Translucent (held at Theme as an opacity literal; effective colour from what it sits over). Take the whole state set (idle/hover/pressed) together. Contrast: translucent — verify 3:1 against effective adjacent colour at point of use (WCAG 1.4.11). Scoped to STROKE_COLOR.",
    "name": "color-interactive-border-persistent-white-idle",
    "type": "color",
    "value": "#ffffffcc"
  },
  {
    "comment": "Persistent/white — edge at pressed. On a dark-stable backdrop. Opaque at pressed (resolves to a primitive). Take the whole state set together. Contrast: verify 3:1 against adjacent colours at point of use. Scoped to STROKE_COLOR.",
    "name": "color-interactive-border-persistent-white-pressed",
    "type": "color",
    "value": "#ffffff"
  },
  {
    "comment": "Primary — edge of a primary-voice outlined control at hover. Opaque. Take the whole state set (idle/hover/pressed) together. Contrast: if the only visible state indicator, verify 3:1 against adjacent colours at point of use (WCAG 1.4.11). Scoped to STROKE_COLOR.",
    "name": "color-interactive-border-primary-hover",
    "type": "color",
    "value": "#8faafa"
  },
  {
    "comment": "Primary — edge of a primary-voice outlined interactive control at idle. Opaque. Always take the whole state set (idle/hover/pressed) together. Not for static edges (→ color/border/*) or disabled (→ color/utility/disabled/*). Contrast: standards-derived, not measured (edge against adjacency). If this is the only visible state indicator, it must clear 3:1 against adjacent colours (WCAG 1.4.11), verified at point of use. Scoped to STROKE_COLOR.",
    "name": "color-interactive-border-primary-idle",
    "type": "color",
    "value": "#7697ff"
  },
  {
    "comment": "Primary — edge of a primary-voice outlined control at pressed. Opaque. Take the whole state set together. Contrast: verify 3:1 at point of use if the only state indicator. Scoped to STROKE_COLOR.",
    "name": "color-interactive-border-primary-pressed",
    "type": "color",
    "value": "#b8ccff"
  },
  {
    "comment": "Danger — glyph of a danger-voice interactive control at hover. For controls without per-brand component/* foreground tokens. Take the whole state set together. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-interactive-icon-danger-hover",
    "type": "color",
    "value": "#f0907f"
  },
  {
    "comment": "Danger — glyph of a destructive-action or error-carrying interactive control at idle. For controls without per-brand component/* foreground tokens (fill is not the test). Always take the whole state set (idle/hover/pressed) together. Not for static semantic icons (→ color/icon/support/danger) or disabled. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-interactive-icon-danger-idle",
    "type": "color",
    "value": "#f1735e"
  },
  {
    "comment": "Danger — glyph of a danger-voice interactive control at pressed. For controls without per-brand component/* foreground tokens. Take the whole state set together. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-interactive-icon-danger-pressed",
    "type": "color",
    "value": "#febbae"
  },
  {
    "comment": "Link-brand — glyph of the brand-voiced link at hover. Take the full state set (idle/hover/pressed/visited) together. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-interactive-icon-link-brand-hover",
    "type": "color",
    "value": "#8faafa"
  },
  {
    "comment": "Link-brand — glyph of the deliberately brand-voiced link at idle. Diverges per brand to carry product identity. Pick when a link&#39;s icon should read as the brand&#39;s own. Pick by voice, not hue. Mirrors text/link-brand one-for-one. Take the full state set (idle/hover/pressed/visited) together. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-interactive-icon-link-brand-idle",
    "type": "color",
    "value": "#7697ff"
  },
  {
    "comment": "Link-brand — glyph of the brand-voiced link at pressed. Take the full state set together. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-interactive-icon-link-brand-pressed",
    "type": "color",
    "value": "#b8ccff"
  },
  {
    "comment": "Link-brand — glyph of the brand-voiced link at visited. The visited colour is shared across all three link families. Take the full state set together. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-interactive-icon-link-brand-visited",
    "type": "color",
    "value": "#b88cff"
  },
  {
    "comment": "Link-default — glyph of the system&#39;s default link voice at hover. Take the full state set (idle/hover/pressed/visited) together. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-interactive-icon-link-default-hover",
    "type": "color",
    "value": "#8faafa"
  },
  {
    "comment": "Link-default — glyph of the system&#39;s default link voice at idle. One fixed link-blue applied as the link role across all brands. Pick this family when the link should read as the system&#39;s standard hyperlink. Pick by voice, not hue — the hue follows from the active brand. Mirrors text/link-default one-for-one. Take the full state set (idle/hover/pressed/visited) together. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-interactive-icon-link-default-idle",
    "type": "color",
    "value": "#7697ff"
  },
  {
    "comment": "Link-default — glyph of the system&#39;s default link voice at pressed. Take the full state set together. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-interactive-icon-link-default-pressed",
    "type": "color",
    "value": "#b8ccff"
  },
  {
    "comment": "Link-default — glyph of the system&#39;s default link voice at visited. The visited colour is shared across all three link families. Still chosen through the link-default family. Take the full state set (idle/hover/pressed/visited) together. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-interactive-icon-link-default-visited",
    "type": "color",
    "value": "#b88cff"
  },
  {
    "comment": "Link-neutral — glyph of the deliberately quiet link at hover. Take the full state set (idle/hover/pressed/visited) together. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-interactive-icon-link-neutral-hover",
    "type": "color",
    "value": "#c0c0c1"
  },
  {
    "comment": "Link-neutral — glyph of the deliberately quiet link at idle. For a link that should recede. Pick by voice, not hue. Mirrors text/link-neutral one-for-one. Take the full state set (idle/hover/pressed/visited) together. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-interactive-icon-link-neutral-idle",
    "type": "color",
    "value": "#ffffff"
  },
  {
    "comment": "Link-neutral — glyph of the deliberately quiet link at pressed. Take the full state set together. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-interactive-icon-link-neutral-pressed",
    "type": "color",
    "value": "#949495"
  },
  {
    "comment": "Link-neutral — glyph of the deliberately quiet link at visited. The visited colour is shared across all three link families. Take the full state set together. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-interactive-icon-link-neutral-visited",
    "type": "color",
    "value": "#b88cff"
  },
  {
    "comment": "Neutral — glyph of a neutral-voice interactive control at hover. For controls without per-brand component/* foreground tokens. Take the whole state set together. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-interactive-icon-neutral-hover",
    "type": "color",
    "value": "#efeff0"
  },
  {
    "comment": "Neutral — glyph of a neutral-voice interactive control at idle. Quiet, unkeyed non-primary action. For controls without per-brand component/* foreground tokens (fill is not the test). Always take the whole state set (idle/hover/pressed) together. Not for static icons (→ color/icon/*) or disabled. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-interactive-icon-neutral-idle",
    "type": "color",
    "value": "#dfdfe0"
  },
  {
    "comment": "Neutral — glyph of a neutral-voice interactive control at pressed. For controls without per-brand component/* foreground tokens. Take the whole state set together. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-interactive-icon-neutral-pressed",
    "type": "color",
    "value": "#ffffff"
  },
  {
    "comment": "Primary — glyph of a primary-voice interactive control at hover. For controls without per-brand component/* foreground tokens (fill is not the test). Take the whole state set (idle/hover/pressed) together. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-interactive-icon-primary-hover",
    "type": "color",
    "value": "#8faafa"
  },
  {
    "comment": "Primary — glyph of a primary-voice interactive control at idle. For controls that do NOT carry their own per-brand component/* foreground tokens — fill is NOT the test; a filled control without component foregrounds draws its glyph from here. Always take the whole state set (idle/hover/pressed) together. Not for static icons (→ color/icon/*) or disabled (→ color/utility/disabled/icon). Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-interactive-icon-primary-idle",
    "type": "color",
    "value": "#7697ff"
  },
  {
    "comment": "Primary — glyph of a primary-voice interactive control at pressed. For controls without per-brand component/* foreground tokens. Take the whole state set together. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-interactive-icon-primary-pressed",
    "type": "color",
    "value": "#b8ccff"
  },
  {
    "comment": "Danger — label of a danger-voice interactive control at hover. For controls without per-brand component/* foreground tokens. Take the whole state set together. Scoped to TEXT_FILL.",
    "name": "color-interactive-text-danger-hover",
    "type": "color",
    "value": "#f0907f"
  },
  {
    "comment": "Danger — label of a destructive-action or error-carrying interactive control at idle. For controls without per-brand component/* foreground tokens (fill is not the test). Always take the whole state set (idle/hover/pressed) together. Not for static semantic text (→ color/text/support/danger) or disabled. Scoped to TEXT_FILL.",
    "name": "color-interactive-text-danger-idle",
    "type": "color",
    "value": "#f1735e"
  },
  {
    "comment": "Danger — label of a danger-voice interactive control at pressed. For controls without per-brand component/* foreground tokens. Take the whole state set together. Scoped to TEXT_FILL.",
    "name": "color-interactive-text-danger-pressed",
    "type": "color",
    "value": "#febbae"
  },
  {
    "comment": "Link-brand — the deliberately brand-voiced link at hover. Take the full state set (idle/hover/pressed/visited) together. Scoped to TEXT_FILL.",
    "name": "color-interactive-text-link-brand-hover",
    "type": "color",
    "value": "#8faafa"
  },
  {
    "comment": "Link-brand — the deliberately brand-voiced link at idle. Diverges per brand to carry product identity. Pick when a link should read as the brand&#39;s own, not the system&#39;s default. Pick by voice, not hue. In a brand whose primary colour is the link-blue, the value may coincide with link-default — they remain different families; pick by voice. Take the full state set (idle/hover/pressed/visited) together. Scoped to TEXT_FILL.",
    "name": "color-interactive-text-link-brand-idle",
    "type": "color",
    "value": "#7697ff"
  },
  {
    "comment": "Link-brand — the deliberately brand-voiced link at pressed. Take the full state set together. Scoped to TEXT_FILL.",
    "name": "color-interactive-text-link-brand-pressed",
    "type": "color",
    "value": "#b8ccff"
  },
  {
    "comment": "Link-brand — the deliberately brand-voiced link at visited. The visited colour is shared across all three link families. Still chosen through the link-brand family where the link should carry brand identity. Take the full state set together. Scoped to TEXT_FILL.",
    "name": "color-interactive-text-link-brand-visited",
    "type": "color",
    "value": "#b88cff"
  },
  {
    "comment": "Link-default — the system&#39;s default link voice at hover. Take the full state set (idle/hover/pressed/visited) together. Scoped to TEXT_FILL.",
    "name": "color-interactive-text-link-default-hover",
    "type": "color",
    "value": "#8faafa"
  },
  {
    "comment": "Link-default — the system&#39;s default link voice at idle. One fixed link-blue applied as the link role across all brands. Pick this family when the link should read as the system&#39;s standard hyperlink — not branded (→ link-brand) and not deliberately quiet (→ link-neutral). Pick by voice, not hue: &quot;I want a blue link&quot; is the wrong test; the hue follows from the active brand. Take the full state set (idle/hover/pressed/visited) together. Scoped to TEXT_FILL.",
    "name": "color-interactive-text-link-default-idle",
    "type": "color",
    "value": "#7697ff"
  },
  {
    "comment": "Link-default — the system&#39;s default link voice at pressed. Take the full state set together. Scoped to TEXT_FILL.",
    "name": "color-interactive-text-link-default-pressed",
    "type": "color",
    "value": "#b8ccff"
  },
  {
    "comment": "Link-default — the system&#39;s default link voice at visited (after the link has been followed). The visited colour is shared across all three link families. Still chosen through the link-default family where the link should carry the system&#39;s default identity. Take the full state set (idle/hover/pressed/visited) together. Scoped to TEXT_FILL.",
    "name": "color-interactive-text-link-default-visited",
    "type": "color",
    "value": "#b88cff"
  },
  {
    "comment": "Link-neutral — the deliberately quiet link at hover. Take the full state set (idle/hover/pressed/visited) together. Scoped to TEXT_FILL.",
    "name": "color-interactive-text-link-neutral-hover",
    "type": "color",
    "value": "#c0c0c1"
  },
  {
    "comment": "Link-neutral — the deliberately quiet link at idle. For a link that should recede — e.g. inside a code block where a loud link would compete with the content. Pick by voice, not hue. Take the full state set (idle/hover/pressed/visited) together. Scoped to TEXT_FILL.",
    "name": "color-interactive-text-link-neutral-idle",
    "type": "color",
    "value": "#ffffff"
  },
  {
    "comment": "Link-neutral — the deliberately quiet link at pressed. Take the full state set together. Scoped to TEXT_FILL.",
    "name": "color-interactive-text-link-neutral-pressed",
    "type": "color",
    "value": "#949495"
  },
  {
    "comment": "Link-neutral — the deliberately quiet link at visited. The visited colour is shared across all three link families. Still chosen through the link-neutral family where the link should be deliberately quiet. Take the full state set together. Scoped to TEXT_FILL.",
    "name": "color-interactive-text-link-neutral-visited",
    "type": "color",
    "value": "#b88cff"
  },
  {
    "comment": "Neutral — label of a neutral-voice interactive control at hover. For controls without per-brand component/* foreground tokens. Take the whole state set together. Scoped to TEXT_FILL.",
    "name": "color-interactive-text-neutral-hover",
    "type": "color",
    "value": "#efeff0"
  },
  {
    "comment": "Neutral — label of a neutral-voice interactive control at idle. Quiet, unkeyed non-primary action. For controls without per-brand component/* foreground tokens (fill is not the test). Always take the whole state set (idle/hover/pressed) together. Not for static text (→ color/text/*) or disabled. Scoped to TEXT_FILL.",
    "name": "color-interactive-text-neutral-idle",
    "type": "color",
    "value": "#dfdfe0"
  },
  {
    "comment": "Neutral — label of a neutral-voice interactive control at pressed. For controls without per-brand component/* foreground tokens. Take the whole state set together. Scoped to TEXT_FILL.",
    "name": "color-interactive-text-neutral-pressed",
    "type": "color",
    "value": "#ffffff"
  },
  {
    "comment": "Primary — label of a primary-voice interactive control at hover. For controls without per-brand component/* foreground tokens (fill is not the test). Take the whole state set (idle/hover/pressed) together. Scoped to TEXT_FILL.",
    "name": "color-interactive-text-primary-hover",
    "type": "color",
    "value": "#8faafa"
  },
  {
    "comment": "Primary — label of a primary-voice interactive control at idle. For controls that do NOT carry their own per-brand component/* foreground tokens — fill is NOT the test; a filled control without component foregrounds draws its label from here. Always take the whole state set (idle/hover/pressed) together. Not for static text (→ color/text/*) or disabled (→ color/utility/disabled/text). Scoped to TEXT_FILL.",
    "name": "color-interactive-text-primary-idle",
    "type": "color",
    "value": "#7697ff"
  },
  {
    "comment": "Primary — label of a primary-voice interactive control at pressed. For controls without per-brand component/* foreground tokens. Take the whole state set together. Scoped to TEXT_FILL.",
    "name": "color-interactive-text-primary-pressed",
    "type": "color",
    "value": "#b8ccff"
  },
  {
    "comment": "Floating surface — dialogs, popovers, menus, context menus, tooltips, toasts, dropdowns. Pair with elevation/shadow/* or color/border/*. Not for: cards/layout content (→ raised); canvas/nav (→ primary/secondary); fills inside an overlay (→ color/background/*). Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-surface-overlay",
    "type": "color",
    "value": "#303031"
  },
  {
    "comment": "Architectural surface — canvas, header, side nav, footer, persistent panels. Peer to secondary; neither is more elevated. Not for: cards (→ raised); dialogs/menus (→ overlay); coloured fills on a surface (→ color/background/*). Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-surface-primary",
    "type": "color",
    "value": "#0a0a0a"
  },
  {
    "comment": "Elevated-content surface — cards, content tiles, grouped blocks sitting above the canvas but part of the layout. Pair with elevation/shadow/* or color/border/* to make the lift visible. Not for: canvas/header/nav (→ primary/secondary); dialogs/tooltips (→ overlay); fills inside a card (→ color/background/*). Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-surface-raised",
    "type": "color",
    "value": "#2a2a2b"
  },
  {
    "comment": "Architectural surface — same role as primary, second tonal option for composing contrast within the interface structure. Not for: cards (→ raised); dialogs/menus (→ overlay); coloured fills on a surface (→ color/background/*). Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-surface-secondary",
    "type": "color",
    "value": "#19191a"
  },
  {
    "comment": "The product asserting itself — calls to action, brand emphasis, featured statements. Sparing by design — overuse drains the signal. Not for: main reading content (→ neutral/primary); supporting content (→ secondary); semantic states (→ support/*); medium/strong fills.\nGuaranteed AA: all 4 surfaces, neutral 00–01 (02–03 manual), subtle support (danger/info/success/warning). Scoped to TEXT_FILL.",
    "name": "color-text-brand-primary",
    "type": "color",
    "value": "#7697ff"
  },
  {
    "comment": "Neutral voice on backdrops whose tonal value flips across themes — saturated semantic fills, dark neutral background, inverse interactive surfaces. Not a &quot;white text&quot; token. Not for: stable backdrops (→ primary; inverse produces near-zero contrast in one theme); warning saturated fill (→ persistent-black utility).\nGuaranteed AA: strong support fills (info/success/danger/neutral), dark neutral background. Scoped to TEXT_FILL.",
    "name": "color-text-neutral-inverse",
    "type": "color",
    "value": "#0a0a0a"
  },
  {
    "comment": "Anchor voice — headings, titles, data inside components (input values, table cells), menu/list items, active states. Not for: body copy/descriptions (→ secondary); form labels/helpers/captions (→ secondary); brand assertion (→ brand/primary); semantic states (→ support/*); flipping backdrops (→ inverse); interactive controls (component selects).\nGuaranteed AA: all 4 surfaces, neutral 00–03, all subtle + medium support. Scoped to TEXT_FILL.",
    "name": "color-text-neutral-primary",
    "type": "color",
    "value": "#ffffff"
  },
  {
    "comment": "Body voice — body copy, form labels, helper text, captions, metadata. Not for: headings/titles/data values (→ primary); brand assertion (→ brand/primary); semantic states (→ support/*); flipping backdrops (→ inverse); interactive controls (component selects); NOT the empty-field prompt text (→ utility/placeholder/text, component-owned).\nGuaranteed AA: all 4 surfaces, neutral 00–03, subtle support. Not for medium support fills (primary covers those; secondary does not). Scoped to TEXT_FILL.",
    "name": "color-text-neutral-secondary",
    "type": "color",
    "value": "#aaaaab"
  },
  {
    "comment": "Semantic text — danger charge, cues &quot;wrong&quot; before words are read. Not for: warnings that aren&#39;t errors; decorative emphasis; text on any danger-coloured fill (signal collapse — use neutral/inverse on danger fills).\nGuaranteed AA: all 4 surfaces, neutral 00–03, subtle support for other charges (NOT danger-subtle — semantic exclusion). Scoped to TEXT_FILL.",
    "name": "color-text-support-danger",
    "type": "color",
    "value": "#f1735e"
  },
  {
    "comment": "Semantic text — info charge, cues &quot;for your information, no action required&quot;. Not for: main reading content (→ neutral/primary); error conditions (→ danger); text on any info-coloured fill (signal collapse — use neutral/inverse).\nGuaranteed AA: all 4 surfaces, neutral 00–01 (02–03 manual). Scoped to TEXT_FILL.",
    "name": "color-text-support-info",
    "type": "color",
    "value": "#7697ff"
  },
  {
    "comment": "Semantic text — success charge, cues &quot;this is done, this is right&quot;. Not for: main reading content (→ neutral/primary); error conditions (→ danger); text on any success-coloured fill (signal collapse — use neutral/inverse).\nGuaranteed AA: all 4 surfaces, neutral 00–02 (03 manual). Scoped to TEXT_FILL.",
    "name": "color-text-support-success",
    "type": "color",
    "value": "#49b140"
  },
  {
    "comment": "Disabled fill (opaque) — for when translucent disabled/background bleeds through the backdrop. Use alongside disabled/border, /icon, /text. Not for enabled low-emphasis content. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-utility-disabled-background-solid",
    "type": "color",
    "value": "#4f4f50"
  },
  {
    "comment": "Disabled fill — translucent treatment for a control rendered unavailable. Use alongside disabled/border, /icon, /text; all four must dim together. Caution: same value as opacity/03 — pick by mechanic. When translucent bleeds incorrectly, use background-solid instead. Not for enabled low-emphasis content (&quot;quiet&quot; ≠ &quot;disabled&quot;). Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-utility-disabled-background",
    "type": "color",
    "value": "#ffffff14"
  },
  {
    "comment": "Disabled border — translucent. Caution: same value as opacity/04 — pick by mechanic. Use alongside disabled/background, /icon, /text. Not for enabled content. Scoped to STROKE_COLOR.",
    "name": "color-utility-disabled-border",
    "type": "color",
    "value": "#ffffff1f"
  },
  {
    "comment": "Disabled icon. Use alongside disabled/background, /border, /text. Not for enabled but quiet icons — disabled means &quot;cannot be used&quot;, not &quot;quiet&quot;. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-utility-disabled-icon",
    "type": "color",
    "value": "#6a6a6b"
  },
  {
    "comment": "Disabled fill — inverse context (dark backdrop). Use when a disabled control sits on a dark surface. Prefer over per-instance mode override. Use alongside disabled/inverse/border, /icon, /text. Not for the everyday context (→ disabled/background). Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-utility-disabled-inverse-background",
    "type": "color",
    "value": "#00000014"
  },
  {
    "comment": "Disabled border — inverse context (dark backdrop). Use alongside disabled/inverse/background, /icon, /text. Not for everyday context (→ disabled/border). Scoped to STROKE_COLOR.",
    "name": "color-utility-disabled-inverse-border",
    "type": "color",
    "value": "#0000001f"
  },
  {
    "comment": "Disabled icon — inverse context (dark backdrop). Use alongside disabled/inverse/background, /border, /text. Not for everyday context. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-utility-disabled-inverse-icon",
    "type": "color",
    "value": "#6a6a6b"
  },
  {
    "comment": "Disabled text — inverse context (dark backdrop). Use alongside disabled/inverse/background, /border, /icon. Not for everyday context (→ disabled/text). Scoped to TEXT_FILL.",
    "name": "color-utility-disabled-inverse-text",
    "type": "color",
    "value": "#6a6a6b"
  },
  {
    "comment": "Disabled fill — persistent/black context (fixed-black backdrop). Use alongside disabled/persistent/black/border, /icon, /text. Not for everyday or inverse contexts. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-utility-disabled-persistent-black-background",
    "type": "color",
    "value": "#00000014"
  },
  {
    "comment": "Disabled border — persistent/black context. Use alongside persistent/black/background, /icon, /text. Scoped to STROKE_COLOR.",
    "name": "color-utility-disabled-persistent-black-border",
    "type": "color",
    "value": "#0000001f"
  },
  {
    "comment": "Disabled icon — persistent/black context. Use alongside persistent/black/background, /border, /text. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-utility-disabled-persistent-black-icon",
    "type": "color",
    "value": "#6a6a6b"
  },
  {
    "comment": "Disabled text — persistent/black context. Use alongside persistent/black/background, /border, /icon. Scoped to TEXT_FILL.",
    "name": "color-utility-disabled-persistent-black-text",
    "type": "color",
    "value": "#6a6a6b"
  },
  {
    "comment": "Disabled fill — persistent/white context (fixed-white backdrop). Use alongside disabled/persistent/white/border, /icon, /text. Not for everyday (→ disabled/background) or inverse context. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-utility-disabled-persistent-white-background",
    "type": "color",
    "value": "#ffffff14"
  },
  {
    "comment": "Disabled border — persistent/white context. Use alongside persistent/white/background, /icon, /text. Not for everyday or inverse contexts. Scoped to STROKE_COLOR.",
    "name": "color-utility-disabled-persistent-white-border",
    "type": "color",
    "value": "#ffffff1f"
  },
  {
    "comment": "Disabled icon — persistent/white context. Use alongside persistent/white/background, /border, /text. Scoped to FRAME_FILL, SHAPE_FILL, STROKE_COLOR.",
    "name": "color-utility-disabled-persistent-white-icon",
    "type": "color",
    "value": "#a3a3a3"
  },
  {
    "comment": "Disabled text — persistent/white context. Use alongside persistent/white/background, /border, /icon. Scoped to TEXT_FILL.",
    "name": "color-utility-disabled-persistent-white-text",
    "type": "color",
    "value": "#a3a3a3"
  },
  {
    "comment": "Disabled text. Use alongside disabled/background, /border, /icon. Not for enabled low-emphasis text — disabled means &quot;cannot be used&quot;, not &quot;quiet&quot;. Scoped to TEXT_FILL.",
    "name": "color-utility-disabled-text",
    "type": "color",
    "value": "#6a6a6b"
  },
  {
    "comment": "Keyboard-focus ring — the visible indicator of which control holds focus. Lives in color/utility/*, NOT color/border/*. Published focusable controls bind this internally. Not for: structural or charged edges (→ color/border/*); brand edges even when value coincides — pick by mechanic. Must clear 3:1 against adjacent colours (WCAG 1.4.11), verified at point of use. Scoped to STROKE_COLOR.",
    "name": "color-utility-focus-border",
    "type": "color",
    "value": "#7697ff"
  },
  {
    "comment": "Utility mechanic — opacity. Rung 01 of the raw transparency axis — the faintest veil. Resolves to black at low opacity in light theme and white in dark theme. Held at Theme as an opacity literal (chain: Brand → Theme only). Reach for directly while composing UI for a barely-there translucent layer; also drawn on internally by the system&#39;s translucent treatments. ALL_SCOPES is correct here — the one intentional ALL_SCOPES case in the colour system; the opacity ladder composes in every picker by design.\n\nDo not use to fake a disabled state (→ disabled/*; disabled/background = opacity/03 in value — mechanics differ). Do not use for a finished semantic layer (→ scrim/default). Do not assign a fixed meaning to this rung — it is a position on an axis of veiling, not a named role. No contrast guarantee.",
    "name": "color-utility-opacity-01",
    "type": "color",
    "value": "#ffffff05"
  },
  {
    "comment": "Utility mechanic — opacity. Rung 02 of the raw transparency axis. Resolves to black in light theme and white in dark theme at increasing opacity. Held at Theme as an opacity literal. ALL_SCOPES is correct — the one intentional ALL_SCOPES case.\n\nDo not use to fake a disabled state (→ disabled/*). Do not use for a finished semantic layer (→ scrim/default). Do not assign a fixed meaning to this rung. No contrast guarantee.",
    "name": "color-utility-opacity-02",
    "type": "color",
    "value": "#ffffff0a"
  },
  {
    "comment": "Utility mechanic — opacity. Rung 03 of the raw transparency axis. Held at Theme as an opacity literal. Caution: shares a value with disabled/background — values coincide; mechanics don&#39;t. Pick disabled/background to dim a control (the authored disabled treatment); reach for this rung only when &quot;veil by this amount&quot; is the intent with no disabled meaning. ALL_SCOPES is correct — the one intentional ALL_SCOPES case.\n\nDo not use to fake a disabled state (→ disabled/*). Do not assign a fixed meaning to this rung. No contrast guarantee.",
    "name": "color-utility-opacity-03",
    "type": "color",
    "value": "#ffffff14"
  },
  {
    "comment": "Utility mechanic — opacity. Rung 04 of the raw transparency axis. Held at Theme as an opacity literal. Caution: shares a value with disabled/border — values coincide; mechanics don&#39;t. Pick disabled/border for the disabled control&#39;s border; reach for this rung only when &quot;veil by this amount&quot; is the intent with no disabled meaning. ALL_SCOPES is correct — the one intentional ALL_SCOPES case.\n\nDo not use to fake a disabled state (→ disabled/*). Do not assign a fixed meaning to this rung. No contrast guarantee.",
    "name": "color-utility-opacity-04",
    "type": "color",
    "value": "#ffffff1f"
  },
  {
    "comment": "Utility mechanic — opacity. Rung 05 of the raw transparency axis — the mid-point. Resolves to black in light theme and white in dark theme. Held at Theme as an opacity literal. ALL_SCOPES is correct — the one intentional ALL_SCOPES case.\n\nDo not use to fake a disabled state (→ disabled/*). Do not use for a finished semantic layer (→ scrim/default). Do not assign a fixed meaning to this rung. No contrast guarantee.",
    "name": "color-utility-opacity-05",
    "type": "color",
    "value": "#ffffff29"
  },
  {
    "comment": "Utility mechanic — opacity. Rung 06 of the raw transparency axis. Resolves to black in light theme and white in dark theme. Held at Theme as an opacity literal. ALL_SCOPES is correct — the one intentional ALL_SCOPES case.\n\nDo not use to fake a disabled state (→ disabled/*). Do not use for a finished semantic layer. Do not assign a fixed meaning to this rung. No contrast guarantee.",
    "name": "color-utility-opacity-06",
    "type": "color",
    "value": "#ffffff3d"
  },
  {
    "comment": "Utility mechanic — opacity. Rung 07 of the raw transparency axis. Resolves to black in light theme and white in dark theme. Held at Theme as an opacity literal. ALL_SCOPES is correct — the one intentional ALL_SCOPES case.\n\nDo not use to fake a disabled state (→ disabled/*). Do not use for a finished semantic layer. Do not assign a fixed meaning to this rung. No contrast guarantee.",
    "name": "color-utility-opacity-07",
    "type": "color",
    "value": "#ffffff52"
  },
  {
    "comment": "Utility mechanic — opacity. Rung 08 of the raw transparency axis — a dense veil. Resolves to black at high opacity in light theme and white in dark theme. Held at Theme as an opacity literal. ALL_SCOPES is correct — the one intentional ALL_SCOPES case.\n\nDo not use to fake a disabled state (→ disabled/*). Do not use for a finished semantic layer. Do not assign a fixed meaning to this rung. No contrast guarantee.",
    "name": "color-utility-opacity-08",
    "type": "color",
    "value": "#ffffff7a"
  },
  {
    "comment": "Utility mechanic — opacity. Rung 09 of the raw transparency axis — a very dense veil. Resolves to black at very high opacity in light theme and white in dark theme. Held at Theme as an opacity literal. ALL_SCOPES is correct — the one intentional ALL_SCOPES case.\n\nDo not use to fake a disabled state (→ disabled/*). Do not use for a finished semantic layer. Do not assign a fixed meaning to this rung. No contrast guarantee.",
    "name": "color-utility-opacity-09",
    "type": "color",
    "value": "#ffffffa3"
  },
  {
    "comment": "Utility mechanic — opacity. Rung 10 of the raw transparency axis — the densest veil. Resolves to black at near-full opacity in light theme and white in dark theme. Held at Theme as an opacity literal. ALL_SCOPES is correct — the one intentional ALL_SCOPES case.\n\nDo not use to fake a disabled state (→ disabled/*). Do not use for a finished semantic layer (→ scrim/default). Do not assign a fixed meaning to this rung — the ladder is an axis of veiling, not a set of named roles. No contrast guarantee.",
    "name": "color-utility-opacity-10",
    "type": "color",
    "value": "#ffffffcc"
  },
  {
    "comment": "Persistent black — fixed value in both themes; does not flip. Use for fills or content that must stay black regardless of theme. Not for: general black (defeats theming — use theme-aware neutrals); dark architectural layers (→ color/surface/*).\nForeground: icon/neutral/secondary + all support icons guaranteed. Text pairings Manual. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-utility-persistent-black",
    "type": "color",
    "value": "#0a0a0a"
  },
  {
    "comment": "Persistent translucent white — fixed in both themes; does not flip. Use for a translucent white layer over a dark or shifting backdrop that must stay unchanged when theme switches. Translucent: no measured foreground. No TEXT_FILL scope. Scoped to ALL_FILLS, STROKE_COLOR.",
    "name": "color-utility-persistent-transparent-white",
    "type": "color",
    "value": "#ffffffcc"
  },
  {
    "comment": "Persistent white — fixed value in both themes; does not flip. Use for fills or content that must stay white regardless of theme. Not for general white — use theme-aware neutrals unless the fixed value is explicit intent.\nForeground: all pairings Manual. Not: icon/support/warning. Scoped to FRAME_FILL, SHAPE_FILL, TEXT_FILL, STROKE_COLOR.",
    "name": "color-utility-persistent-white",
    "type": "color",
    "value": "#ffffff"
  },
  {
    "comment": "Placeholder — the dimmed hint icon inside an empty input; the prompt glyph drawn as a stroked vector. Components own this internally. Not for: icons in a filled/active input; general &quot;quiet icon&quot;. No contrast guarantee. Scoped to STROKE_COLOR.",
    "name": "color-utility-placeholder-icon",
    "type": "color",
    "value": "#868687"
  },
  {
    "comment": "Placeholder — the dimmed hint text inside an empty input; replaced by the user&#39;s own content when they type. Components own this internally. Not for: supplied content (→ color/text/*); labels or helpers beside an input (→ color/text/neutral/secondary); general &quot;quiet grey text&quot;. No contrast guarantee — deliberately exempt so it reads quieter than the value it hints at. Scoped to TEXT_FILL.",
    "name": "color-utility-placeholder-text",
    "type": "color",
    "value": "#868687"
  },
  {
    "comment": "Overlay-dimming layer — the dark translucent fill placed between the content behind and the overlay above it. The overlay sits ON the scrim. Not for: translucent panel fills (→ color/surface/*); general transparency (→ opacity/*). No contrast guarantee — content sits on the overlay, not the scrim. Scoped to FRAME_FILL, SHAPE_FILL.",
    "name": "color-utility-scrim-default",
    "type": "color",
    "value": "#000000cc"
  },
  {
    "name": "component-button-global-border-radius",
    "type": "number",
    "value": "4px"
  },
  {
    "name": "component-button-global-focus-border-radius",
    "type": "number",
    "value": "4px"
  },
  {
    "name": "component-button-type-lg-font-family",
    "type": "fontFamily",
    "value": "\"Roboto Flex\", sans-serif"
  },
  {
    "name": "component-button-type-lg-font-size",
    "type": "number",
    "value": "16px"
  },
  {
    "name": "component-button-type-lg-font-weight",
    "type": "fontWeight",
    "value": 500
  },
  {
    "name": "component-button-type-lg-line-height",
    "type": "number",
    "value": "24px"
  },
  {
    "name": "component-button-type-md-font-family",
    "type": "fontFamily",
    "value": "\"Roboto Flex\", sans-serif"
  },
  {
    "name": "component-button-type-md-font-size",
    "type": "number",
    "value": "14px"
  },
  {
    "name": "component-button-type-md-font-weight",
    "type": "fontWeight",
    "value": 500
  },
  {
    "name": "component-button-type-md-line-height",
    "type": "number",
    "value": "20px"
  },
  {
    "name": "component-button-type-sm-font-family",
    "type": "fontFamily",
    "value": "\"Roboto Flex\", sans-serif"
  },
  {
    "name": "component-button-type-sm-font-size",
    "type": "number",
    "value": "12px"
  },
  {
    "name": "component-button-type-sm-font-weight",
    "type": "fontWeight",
    "value": 500
  },
  {
    "name": "component-button-type-sm-line-height",
    "type": "number",
    "value": "18px"
  },
  {
    "name": "component-button-variant-fill-danger-icon",
    "type": "color",
    "value": "#ffffff"
  },
  {
    "name": "component-button-variant-fill-danger-text",
    "type": "color",
    "value": "#ffffff"
  },
  {
    "name": "component-button-variant-fill-neutral-icon",
    "type": "color",
    "value": "#ffffff"
  },
  {
    "name": "component-button-variant-fill-neutral-text",
    "type": "color",
    "value": "#ffffff"
  },
  {
    "name": "component-button-variant-fill-primary-icon",
    "type": "color",
    "value": "#ffffff"
  },
  {
    "name": "component-button-variant-fill-primary-text",
    "type": "color",
    "value": "#ffffff"
  },
  {
    "name": "component-button-variant-outline-danger-border-hover",
    "type": "color",
    "value": "#ffffff6b"
  },
  {
    "name": "component-button-variant-outline-danger-border-idle",
    "type": "color",
    "value": "#ffffff4d"
  },
  {
    "name": "component-button-variant-outline-danger-border-pressed",
    "type": "color",
    "value": "#ffffff8a"
  },
  {
    "name": "component-button-variant-outline-neutral-border-hover",
    "type": "color",
    "value": "#ffffff6b"
  },
  {
    "name": "component-button-variant-outline-neutral-border-idle",
    "type": "color",
    "value": "#ffffff4d"
  },
  {
    "name": "component-button-variant-outline-neutral-border-pressed",
    "type": "color",
    "value": "#ffffff8a"
  },
  {
    "name": "component-button-variant-outline-primary-border-hover",
    "type": "color",
    "value": "#ffffff6b"
  },
  {
    "name": "component-button-variant-outline-primary-border-idle",
    "type": "color",
    "value": "#ffffff4d"
  },
  {
    "name": "component-button-variant-outline-primary-border-pressed",
    "type": "color",
    "value": "#ffffff8a"
  },
  {
    "name": "component-tag-selectable-neutral-selected-icon",
    "type": "color",
    "value": "#ffffff"
  },
  {
    "name": "component-tag-selectable-neutral-selected-text",
    "type": "color",
    "value": "#ffffff"
  },
  {
    "name": "component-utility-icons-stroke-weight-lg",
    "type": "dimension",
    "value": "2px"
  },
  {
    "name": "component-utility-icons-stroke-weight-md",
    "type": "dimension",
    "value": "1.75px"
  },
  {
    "name": "component-utility-icons-stroke-weight-sm",
    "type": "dimension",
    "value": "1.5px"
  },
  {
    "name": "component-utility-icons-stroke-weight-xl",
    "type": "dimension",
    "value": "2.25px"
  },
  {
    "name": "component-utility-icons-stroke-weight-xs",
    "type": "dimension",
    "value": "1.25px"
  },
  {
    "name": "component-utility-icons-stroke-weight-xxs",
    "type": "dimension",
    "value": "1px"
  },
  {
    "name": "cross-component-track-default",
    "type": "color",
    "value": "#ffffff1a"
  },
  {
    "name": "font-dynamic-display-lg",
    "type": "typography",
    "value": "var(--type-font-weight-display-regular) 53px / 60px var(--type-font-family-primary)"
  },
  {
    "name": "font-dynamic-display-md",
    "type": "typography",
    "value": "var(--type-font-weight-display-regular) 40px / 46px var(--type-font-family-primary)"
  },
  {
    "name": "font-dynamic-heading-lg-bold",
    "type": "typography",
    "value": "var(--type-font-weight-heading-bold) 26px / 32px var(--type-font-family-secondary)"
  },
  {
    "name": "font-dynamic-heading-lg-default",
    "type": "typography",
    "value": "var(--type-font-weight-heading-default) 26px / 32px var(--type-font-family-secondary)"
  },
  {
    "name": "font-dynamic-heading-xl",
    "type": "typography",
    "value": "var(--type-font-weight-heading-regular) 30px / 34px var(--type-font-family-primary)"
  },
  {
    "name": "font-dynamic-heading-xxl",
    "type": "typography",
    "value": "var(--type-font-weight-heading-regular) 34px / 40px var(--type-font-family-primary)"
  },
  {
    "name": "font-dynamic-heading-xxxl",
    "type": "typography",
    "value": "var(--type-font-weight-heading-regular) 36px / 42px var(--type-font-family-primary)"
  },
  {
    "name": "font-static-body-lg-bold",
    "type": "typography",
    "value": "var(--type-font-weight-body-bold) 17px / 26px var(--type-font-family-secondary)"
  },
  {
    "name": "font-static-body-lg-default",
    "type": "typography",
    "value": "var(--type-font-weight-body-default) 17px / 26px var(--type-font-family-secondary)"
  },
  {
    "name": "font-static-body-md-bold",
    "type": "typography",
    "value": "var(--type-font-weight-body-bold) 16px / 24px var(--type-font-family-secondary)"
  },
  {
    "name": "font-static-body-md-default",
    "type": "typography",
    "value": "var(--type-font-weight-body-default) 16px / 24px var(--type-font-family-secondary)"
  },
  {
    "name": "font-static-body-sm-compact-bold",
    "type": "typography",
    "value": "var(--type-font-weight-body-bold) 13px / 20px var(--type-font-family-secondary)"
  },
  {
    "name": "font-static-body-sm-compact-default",
    "type": "typography",
    "value": "var(--type-font-weight-body-default) 13px / 20px var(--type-font-family-secondary)"
  },
  {
    "name": "font-static-body-sm-bold",
    "type": "typography",
    "value": "var(--type-font-weight-body-bold) 14px / 20px var(--type-font-family-secondary)"
  },
  {
    "name": "font-static-body-sm-default",
    "type": "typography",
    "value": "var(--type-font-weight-body-default) 14px / 20px var(--type-font-family-secondary)"
  },
  {
    "name": "font-static-body-xl-bold",
    "type": "typography",
    "value": "var(--type-font-weight-body-bold) 19px / 28px var(--type-font-family-secondary)"
  },
  {
    "name": "font-static-body-xl-default",
    "type": "typography",
    "value": "var(--type-font-weight-body-default) 19px / 28px var(--type-font-family-secondary)"
  },
  {
    "name": "font-static-body-xs-bold",
    "type": "typography",
    "value": "var(--type-font-weight-body-bold) 12px / 18px var(--type-font-family-secondary)"
  },
  {
    "name": "font-static-body-xs-default",
    "type": "typography",
    "value": "var(--type-font-weight-body-default) 12px / 18px var(--type-font-family-secondary)"
  },
  {
    "name": "font-static-body-xxl-bold",
    "type": "typography",
    "value": "var(--type-font-weight-body-bold) 22px / 32px var(--type-font-family-secondary)"
  },
  {
    "name": "font-static-body-xxl-default",
    "type": "typography",
    "value": "var(--type-font-weight-body-default) 22px / 32px var(--type-font-family-secondary)"
  },
  {
    "name": "font-static-body-xxs-bold",
    "type": "typography",
    "value": "var(--type-font-weight-body-bold) 10px / 16px var(--type-font-family-secondary)"
  },
  {
    "name": "font-static-body-xxs-default",
    "type": "typography",
    "value": "var(--type-font-weight-body-default) 10px / 16px var(--type-font-family-secondary)"
  },
  {
    "name": "font-static-code-lg-bold",
    "type": "typography",
    "value": "var(--type-font-weight-code-bold) 17px / 26px var(--type-font-family-tertiary)"
  },
  {
    "name": "font-static-code-lg-default",
    "type": "typography",
    "value": "var(--type-font-weight-code-default) 17px / 26px var(--type-font-family-tertiary)"
  },
  {
    "name": "font-static-code-md-bold",
    "type": "typography",
    "value": "var(--type-font-weight-code-bold) 16px / 24px var(--type-font-family-tertiary)"
  },
  {
    "name": "font-static-code-md-default",
    "type": "typography",
    "value": "var(--type-font-weight-code-default) 16px / 24px var(--type-font-family-tertiary)"
  },
  {
    "name": "font-static-code-sm-bold",
    "type": "typography",
    "value": "var(--type-font-weight-code-bold) 14px / 20px var(--type-font-family-tertiary)"
  },
  {
    "name": "font-static-code-sm-default",
    "type": "typography",
    "value": "var(--type-font-weight-code-default) 14px / 20px var(--type-font-family-tertiary)"
  },
  {
    "name": "font-static-code-xl-bold",
    "type": "typography",
    "value": "var(--type-font-weight-code-bold) 19px / 28px var(--type-font-family-tertiary)"
  },
  {
    "name": "font-static-code-xl-default",
    "type": "typography",
    "value": "var(--type-font-weight-code-default) 19px / 28px var(--type-font-family-tertiary)"
  },
  {
    "name": "font-static-code-xs-bold",
    "type": "typography",
    "value": "var(--type-font-weight-code-bold) 12px / 18px var(--type-font-family-tertiary)"
  },
  {
    "name": "font-static-code-xs-default",
    "type": "typography",
    "value": "var(--type-font-weight-code-default) 12px / 18px var(--type-font-family-tertiary)"
  },
  {
    "name": "font-static-display-lg",
    "type": "typography",
    "value": "var(--type-font-weight-display-regular) 84px / 100px var(--type-font-family-primary)"
  },
  {
    "name": "font-static-display-md",
    "type": "typography",
    "value": "var(--type-font-weight-display-regular) 65px / 74px var(--type-font-family-primary)"
  },
  {
    "name": "font-static-eyebrow-type-bold",
    "type": "typography",
    "value": "var(--type-font-weight-body-bold) 12px / 18px var(--type-font-family-secondary)"
  },
  {
    "name": "font-static-eyebrow-type-default",
    "type": "typography",
    "value": "var(--type-font-weight-body-default) 12px / 18px var(--type-font-family-secondary)"
  },
  {
    "name": "font-static-heading-lg-bold",
    "type": "typography",
    "value": "var(--type-font-weight-heading-bold) 28px / 34px var(--type-font-family-secondary)"
  },
  {
    "name": "font-static-heading-lg-default",
    "type": "typography",
    "value": "var(--type-font-weight-heading-default) 28px / 34px var(--type-font-family-secondary)"
  },
  {
    "name": "font-static-heading-md-bold",
    "type": "typography",
    "value": "var(--type-font-weight-heading-bold) 24px / 30px var(--type-font-family-secondary)"
  },
  {
    "name": "font-static-heading-md-default",
    "type": "typography",
    "value": "var(--type-font-weight-heading-default) 24px / 30px var(--type-font-family-secondary)"
  },
  {
    "name": "font-static-heading-sm-bold",
    "type": "typography",
    "value": "var(--type-font-weight-heading-bold) 20px / 24px var(--type-font-family-secondary)"
  },
  {
    "name": "font-static-heading-sm-default",
    "type": "typography",
    "value": "var(--type-font-weight-heading-default) 20px / 24px var(--type-font-family-secondary)"
  },
  {
    "name": "font-static-heading-xl",
    "type": "typography",
    "value": "var(--type-font-weight-heading-regular) 36px / 42px var(--type-font-family-primary)"
  },
  {
    "name": "font-static-heading-xs-bold",
    "type": "typography",
    "value": "var(--type-font-weight-heading-bold) 17px / 20px var(--type-font-family-secondary)"
  },
  {
    "name": "font-static-heading-xs-default",
    "type": "typography",
    "value": "var(--type-font-weight-heading-default) 17px / 20px var(--type-font-family-secondary)"
  },
  {
    "name": "font-static-heading-xxl",
    "type": "typography",
    "value": "var(--type-font-weight-heading-regular) 44px / 50px var(--type-font-family-primary)"
  },
  {
    "name": "font-static-heading-xxs-bold",
    "type": "typography",
    "value": "var(--type-font-weight-heading-bold) 14px / 18px var(--type-font-family-secondary)"
  },
  {
    "name": "font-static-heading-xxs-default",
    "type": "typography",
    "value": "var(--type-font-weight-heading-default) 14px / 18px var(--type-font-family-secondary)"
  },
  {
    "name": "font-static-heading-xxxl",
    "type": "typography",
    "value": "var(--type-font-weight-heading-regular) 53px / 60px var(--type-font-family-primary)"
  },
  {
    "name": "shadow-high",
    "type": "shadow",
    "value": "0 7px 20px 5px #00000033"
  },
  {
    "name": "shadow-highest",
    "type": "shadow",
    "value": "0 20px 30px 15px #00000033"
  },
  {
    "name": "shadow-low",
    "type": "shadow",
    "value": "0 3px 5px 0 #00000033"
  },
  {
    "name": "shadow-lowest",
    "type": "shadow",
    "value": "0 1px 2px 0 #00000033"
  },
  {
    "name": "shadow-medium",
    "type": "shadow",
    "value": "0 5px 10px 1px #00000033"
  },
  {
    "name": "shadow-none",
    "type": "shadow",
    "value": "0 0 0 0 #00000000"
  },
  {
    "comment": "Sizing. Value: 1px. Sets the fixed extent of an element — a set width or height (a bar&#39;s height, a rail&#39;s width, a control&#39;s dimension). Component-derived scale: this step exists because a component needed this extent, but it serves any UI work requiring that dimension. Choose by the extent the element requires: name the dimension the thing must occupy and pick this step; between two steps, take the nearer.\n\nNever type the literal 1 — bind this variable. Not for gaps or padding — that is the spacing scale (GAP-scoped; same raw Core pool, different scale, different job). Scale is a flat run from smaller to larger extent — no bands, no per-step meaning; an unbound step is part of the scale, not spare stock. Off-scale values are never the answer — if a recurring extent truly goes unmet, the scale is extended at the system level. Scoped to WIDTH_HEIGHT.",
    "name": "sizing-10",
    "type": "number",
    "value": "1px"
  },
  {
    "comment": "Sizing. Value: 28px. Sets the fixed extent of an element — a set width or height (a bar&#39;s height, a rail&#39;s width, a control&#39;s dimension). Component-derived scale: this step exists because a component needed this extent, but it serves any UI work requiring that dimension. Choose by the extent the element requires: name the dimension the thing must occupy and pick this step; between two steps, take the nearer.\n\nNever type the literal 28 — bind this variable. Not for gaps or padding — that is the spacing scale (GAP-scoped; same raw Core pool, different scale, different job). Scale is a flat run from smaller to larger extent — no bands, no per-step meaning; an unbound step is part of the scale, not spare stock. Off-scale values are never the answer — if a recurring extent truly goes unmet, the scale is extended at the system level. Scoped to WIDTH_HEIGHT.",
    "name": "sizing-100",
    "type": "number",
    "value": "28px"
  },
  {
    "comment": "Sizing. Value: 30px. Sets the fixed extent of an element — a set width or height (a bar&#39;s height, a rail&#39;s width, a control&#39;s dimension). Component-derived scale: this step exists because a component needed this extent, but it serves any UI work requiring that dimension. Choose by the extent the element requires: name the dimension the thing must occupy and pick this step; between two steps, take the nearer.\n\nNever type the literal 30 — bind this variable. Not for gaps or padding — that is the spacing scale (GAP-scoped; same raw Core pool, different scale, different job). Scale is a flat run from smaller to larger extent — no bands, no per-step meaning; an unbound step is part of the scale, not spare stock. Off-scale values are never the answer — if a recurring extent truly goes unmet, the scale is extended at the system level. Scoped to WIDTH_HEIGHT.",
    "name": "sizing-110",
    "type": "number",
    "value": "30px"
  },
  {
    "comment": "Sizing. Value: 32px. Sets the fixed extent of an element — a set width or height (a bar&#39;s height, a rail&#39;s width, a control&#39;s dimension). Component-derived scale: this step exists because a component needed this extent, but it serves any UI work requiring that dimension. Choose by the extent the element requires: name the dimension the thing must occupy and pick this step; between two steps, take the nearer.\n\nNever type the literal 32 — bind this variable. Not for gaps or padding — that is the spacing scale (GAP-scoped; same raw Core pool, different scale, different job). Scale is a flat run from smaller to larger extent — no bands, no per-step meaning; an unbound step is part of the scale, not spare stock. Off-scale values are never the answer — if a recurring extent truly goes unmet, the scale is extended at the system level. Scoped to WIDTH_HEIGHT.",
    "name": "sizing-120",
    "type": "number",
    "value": "32px"
  },
  {
    "comment": "Sizing. Value: 34px. Sets the fixed extent of an element — a set width or height (a bar&#39;s height, a rail&#39;s width, a control&#39;s dimension). Component-derived scale: this step exists because a component needed this extent, but it serves any UI work requiring that dimension. Choose by the extent the element requires: name the dimension the thing must occupy and pick this step; between two steps, take the nearer.\n\nNever type the literal 34 — bind this variable. Not for gaps or padding — that is the spacing scale (GAP-scoped; same raw Core pool, different scale, different job). Scale is a flat run from smaller to larger extent — no bands, no per-step meaning; an unbound step is part of the scale, not spare stock. Off-scale values are never the answer — if a recurring extent truly goes unmet, the scale is extended at the system level. Scoped to WIDTH_HEIGHT.",
    "name": "sizing-125",
    "type": "number",
    "value": "34px"
  },
  {
    "comment": "Sizing. Value: 38px. Sets the fixed extent of an element — a set width or height (a bar&#39;s height, a rail&#39;s width, a control&#39;s dimension). Component-derived scale: this step exists because a component needed this extent, but it serves any UI work requiring that dimension. Choose by the extent the element requires: name the dimension the thing must occupy and pick this step; between two steps, take the nearer.\n\nNever type the literal 38 — bind this variable. Not for gaps or padding — that is the spacing scale (GAP-scoped; same raw Core pool, different scale, different job). Scale is a flat run from smaller to larger extent — no bands, no per-step meaning; an unbound step is part of the scale, not spare stock. Off-scale values are never the answer — if a recurring extent truly goes unmet, the scale is extended at the system level. Scoped to WIDTH_HEIGHT.",
    "name": "sizing-130",
    "type": "number",
    "value": "38px"
  },
  {
    "comment": "Sizing. Value: 40px. Sets the fixed extent of an element — a set width or height (a bar&#39;s height, a rail&#39;s width, a control&#39;s dimension). Component-derived scale: this step exists because a component needed this extent, but it serves any UI work requiring that dimension. Choose by the extent the element requires: name the dimension the thing must occupy and pick this step; between two steps, take the nearer.\n\nNever type the literal 40 — bind this variable. Not for gaps or padding — that is the spacing scale (GAP-scoped; same raw Core pool, different scale, different job). Scale is a flat run from smaller to larger extent — no bands, no per-step meaning; an unbound step is part of the scale, not spare stock. Off-scale values are never the answer — if a recurring extent truly goes unmet, the scale is extended at the system level. Scoped to WIDTH_HEIGHT.",
    "name": "sizing-140",
    "type": "number",
    "value": "40px"
  },
  {
    "comment": "Sizing. Value: 46px. Sets the fixed extent of an element — a set width or height (a bar&#39;s height, a rail&#39;s width, a control&#39;s dimension). Component-derived scale: this step exists because a component needed this extent, but it serves any UI work requiring that dimension. Choose by the extent the element requires: name the dimension the thing must occupy and pick this step; between two steps, take the nearer.\n\nNever type the literal 46 — bind this variable. Not for gaps or padding — that is the spacing scale (GAP-scoped; same raw Core pool, different scale, different job). Scale is a flat run from smaller to larger extent — no bands, no per-step meaning; an unbound step is part of the scale, not spare stock. Off-scale values are never the answer — if a recurring extent truly goes unmet, the scale is extended at the system level. Scoped to WIDTH_HEIGHT.",
    "name": "sizing-150",
    "type": "number",
    "value": "46px"
  },
  {
    "comment": "Sizing. Value: 48px. Sets the fixed extent of an element — a set width or height (a bar&#39;s height, a rail&#39;s width, a control&#39;s dimension). Component-derived scale: this step exists because a component needed this extent, but it serves any UI work requiring that dimension. Choose by the extent the element requires: name the dimension the thing must occupy and pick this step; between two steps, take the nearer.\n\nNever type the literal 48 — bind this variable. Not for gaps or padding — that is the spacing scale (GAP-scoped; same raw Core pool, different scale, different job). Scale is a flat run from smaller to larger extent — no bands, no per-step meaning; an unbound step is part of the scale, not spare stock. Off-scale values are never the answer — if a recurring extent truly goes unmet, the scale is extended at the system level. Scoped to WIDTH_HEIGHT.",
    "name": "sizing-160",
    "type": "number",
    "value": "48px"
  },
  {
    "comment": "Sizing. Value: 56px. Sets the fixed extent of an element — a set width or height (a bar&#39;s height, a rail&#39;s width, a control&#39;s dimension). Component-derived scale: this step exists because a component needed this extent, but it serves any UI work requiring that dimension. Choose by the extent the element requires: name the dimension the thing must occupy and pick this step; between two steps, take the nearer.\n\nNever type the literal 56 — bind this variable. Not for gaps or padding — that is the spacing scale (GAP-scoped; same raw Core pool, different scale, different job). Scale is a flat run from smaller to larger extent — no bands, no per-step meaning; an unbound step is part of the scale, not spare stock. Off-scale values are never the answer — if a recurring extent truly goes unmet, the scale is extended at the system level. Scoped to WIDTH_HEIGHT.",
    "name": "sizing-170",
    "type": "number",
    "value": "56px"
  },
  {
    "comment": "Sizing. Value: 80px. Sets the fixed extent of an element — a set width or height (a bar&#39;s height, a rail&#39;s width, a control&#39;s dimension). Component-derived scale: this step exists because a component needed this extent, but it serves any UI work requiring that dimension. Choose by the extent the element requires: name the dimension the thing must occupy and pick this step; between two steps, take the nearer.\n\nNever type the literal 80 — bind this variable. Not for gaps or padding — that is the spacing scale (GAP-scoped; same raw Core pool, different scale, different job). Scale is a flat run from smaller to larger extent — no bands, no per-step meaning; an unbound step is part of the scale, not spare stock. Off-scale values are never the answer — if a recurring extent truly goes unmet, the scale is extended at the system level. Scoped to WIDTH_HEIGHT.",
    "name": "sizing-180",
    "type": "number",
    "value": "80px"
  },
  {
    "comment": "Sizing. Value: 120px. Sets the fixed extent of an element — a set width or height (a bar&#39;s height, a rail&#39;s width, a control&#39;s dimension). Component-derived scale: this step exists because a component needed this extent, but it serves any UI work requiring that dimension. Choose by the extent the element requires: name the dimension the thing must occupy and pick this step; between two steps, take the nearer.\n\nNever type the literal 120 — bind this variable. Not for gaps or padding — that is the spacing scale (GAP-scoped; same raw Core pool, different scale, different job). Scale is a flat run from smaller to larger extent — no bands, no per-step meaning; an unbound step is part of the scale, not spare stock. Off-scale values are never the answer — if a recurring extent truly goes unmet, the scale is extended at the system level. Scoped to WIDTH_HEIGHT.",
    "name": "sizing-190",
    "type": "number",
    "value": "120px"
  },
  {
    "comment": "Sizing. Value: 2px. Sets the fixed extent of an element — a set width or height (a bar&#39;s height, a rail&#39;s width, a control&#39;s dimension). Component-derived scale: this step exists because a component needed this extent, but it serves any UI work requiring that dimension. Choose by the extent the element requires: name the dimension the thing must occupy and pick this step; between two steps, take the nearer.\n\nNever type the literal 2 — bind this variable. Not for gaps or padding — that is the spacing scale (GAP-scoped; same raw Core pool, different scale, different job). Scale is a flat run from smaller to larger extent — no bands, no per-step meaning; an unbound step is part of the scale, not spare stock. Off-scale values are never the answer — if a recurring extent truly goes unmet, the scale is extended at the system level. Scoped to WIDTH_HEIGHT.",
    "name": "sizing-20",
    "type": "number",
    "value": "2px"
  },
  {
    "comment": "Sizing. Value: 160px. Sets the fixed extent of an element — a set width or height (a bar&#39;s height, a rail&#39;s width, a control&#39;s dimension). Component-derived scale: this step exists because a component needed this extent, but it serves any UI work requiring that dimension. Choose by the extent the element requires: name the dimension the thing must occupy and pick this step; between two steps, take the nearer.\n\nNever type the literal 160 — bind this variable. Not for gaps or padding — that is the spacing scale (GAP-scoped; same raw Core pool, different scale, different job). Scale is a flat run from smaller to larger extent — no bands, no per-step meaning; an unbound step is part of the scale, not spare stock. Off-scale values are never the answer — if a recurring extent truly goes unmet, the scale is extended at the system level. Scoped to WIDTH_HEIGHT.",
    "name": "sizing-200",
    "type": "number",
    "value": "160px"
  },
  {
    "comment": "Sizing. Value: 4px. Sets the fixed extent of an element — a set width or height (a bar&#39;s height, a rail&#39;s width, a control&#39;s dimension). Component-derived scale: this step exists because a component needed this extent, but it serves any UI work requiring that dimension. Choose by the extent the element requires: name the dimension the thing must occupy and pick this step; between two steps, take the nearer.\n\nNever type the literal 4 — bind this variable. Not for gaps or padding — that is the spacing scale (GAP-scoped; same raw Core pool, different scale, different job). Scale is a flat run from smaller to larger extent — no bands, no per-step meaning; an unbound step is part of the scale, not spare stock. Off-scale values are never the answer — if a recurring extent truly goes unmet, the scale is extended at the system level. Scoped to WIDTH_HEIGHT.",
    "name": "sizing-30",
    "type": "number",
    "value": "4px"
  },
  {
    "comment": "Sizing. Value: 6px. Sets the fixed extent of an element — a set width or height (a bar&#39;s height, a rail&#39;s width, a control&#39;s dimension). Component-derived scale: this step exists because a component needed this extent, but it serves any UI work requiring that dimension. Choose by the extent the element requires: name the dimension the thing must occupy and pick this step; between two steps, take the nearer.\n\nNever type the literal 6 — bind this variable. Not for gaps or padding — that is the spacing scale (GAP-scoped; same raw Core pool, different scale, different job). Scale is a flat run from smaller to larger extent — no bands, no per-step meaning; an unbound step is part of the scale, not spare stock. Off-scale values are never the answer — if a recurring extent truly goes unmet, the scale is extended at the system level. Scoped to WIDTH_HEIGHT.",
    "name": "sizing-40",
    "type": "number",
    "value": "6px"
  },
  {
    "comment": "Sizing. Value: 8px. Sets the fixed extent of an element — a set width or height (a bar&#39;s height, a rail&#39;s width, a control&#39;s dimension). Component-derived scale: this step exists because a component needed this extent, but it serves any UI work requiring that dimension. Choose by the extent the element requires: name the dimension the thing must occupy and pick this step; between two steps, take the nearer.\n\nNever type the literal 8 — bind this variable. Not for gaps or padding — that is the spacing scale (GAP-scoped; same raw Core pool, different scale, different job). Scale is a flat run from smaller to larger extent — no bands, no per-step meaning; an unbound step is part of the scale, not spare stock. Off-scale values are never the answer — if a recurring extent truly goes unmet, the scale is extended at the system level. Scoped to WIDTH_HEIGHT.",
    "name": "sizing-50",
    "type": "number",
    "value": "8px"
  },
  {
    "comment": "Sizing. Value: 12px. Sets the fixed extent of an element — a set width or height (a bar&#39;s height, a rail&#39;s width, a control&#39;s dimension). Component-derived scale: this step exists because a component needed this extent, but it serves any UI work requiring that dimension. Choose by the extent the element requires: name the dimension the thing must occupy and pick this step; between two steps, take the nearer.\n\nNever type the literal 12 — bind this variable. Not for gaps or padding — that is the spacing scale (GAP-scoped; same raw Core pool, different scale, different job). Scale is a flat run from smaller to larger extent — no bands, no per-step meaning; an unbound step is part of the scale, not spare stock. Off-scale values are never the answer — if a recurring extent truly goes unmet, the scale is extended at the system level. Scoped to WIDTH_HEIGHT.",
    "name": "sizing-60",
    "type": "number",
    "value": "12px"
  },
  {
    "comment": "Sizing. Value: 16px. Sets the fixed extent of an element — a set width or height (a bar&#39;s height, a rail&#39;s width, a control&#39;s dimension). Component-derived scale: this step exists because a component needed this extent, but it serves any UI work requiring that dimension. Choose by the extent the element requires: name the dimension the thing must occupy and pick this step; between two steps, take the nearer.\n\nNever type the literal 16 — bind this variable. Not for gaps or padding — that is the spacing scale (GAP-scoped; same raw Core pool, different scale, different job). Scale is a flat run from smaller to larger extent — no bands, no per-step meaning; an unbound step is part of the scale, not spare stock. Off-scale values are never the answer — if a recurring extent truly goes unmet, the scale is extended at the system level. Scoped to WIDTH_HEIGHT.",
    "name": "sizing-70",
    "type": "number",
    "value": "16px"
  },
  {
    "comment": "Sizing. Value: 20px. Sets the fixed extent of an element — a set width or height (a bar&#39;s height, a rail&#39;s width, a control&#39;s dimension). Component-derived scale: this step exists because a component needed this extent, but it serves any UI work requiring that dimension. Choose by the extent the element requires: name the dimension the thing must occupy and pick this step; between two steps, take the nearer.\n\nNever type the literal 20 — bind this variable. Not for gaps or padding — that is the spacing scale (GAP-scoped; same raw Core pool, different scale, different job). Scale is a flat run from smaller to larger extent — no bands, no per-step meaning; an unbound step is part of the scale, not spare stock. Off-scale values are never the answer — if a recurring extent truly goes unmet, the scale is extended at the system level. Scoped to WIDTH_HEIGHT.",
    "name": "sizing-80",
    "type": "number",
    "value": "20px"
  },
  {
    "comment": "Sizing. Value: 24px. Sets the fixed extent of an element — a set width or height (a bar&#39;s height, a rail&#39;s width, a control&#39;s dimension). Component-derived scale: this step exists because a component needed this extent, but it serves any UI work requiring that dimension. Choose by the extent the element requires: name the dimension the thing must occupy and pick this step; between two steps, take the nearer.\n\nNever type the literal 24 — bind this variable. Not for gaps or padding — that is the spacing scale (GAP-scoped; same raw Core pool, different scale, different job). Scale is a flat run from smaller to larger extent — no bands, no per-step meaning; an unbound step is part of the scale, not spare stock. Off-scale values are never the answer — if a recurring extent truly goes unmet, the scale is extended at the system level. Scoped to WIDTH_HEIGHT.",
    "name": "sizing-90",
    "type": "number",
    "value": "24px"
  },
  {
    "comment": "Spacing — Fine region. Value: 0px. Fine region — advances in very small sub-4px increments; use where small differences are perceptible (component-internal detail, icon-to-label gaps, tight insets).\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 0 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-0",
    "type": "number",
    "value": 0
  },
  {
    "comment": "Spacing — Fine region. Value: 1px. Fine region — advances in very small sub-4px increments; use where small differences are perceptible (component-internal detail, icon-to-label gaps, tight insets).\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 1 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-10",
    "type": "number",
    "value": "1px"
  },
  {
    "comment": "Spacing — Mid region. Value: 16px. Mid region — marches in exact +4px increments; everyday component-internal and tighter between-element spacing.\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 16 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-100",
    "type": "number",
    "value": "16px"
  },
  {
    "comment": "Spacing — Mid region. Value: 20px. Mid region — marches in exact +4px increments; everyday component-internal and tighter between-element spacing.\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 20 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-110",
    "type": "number",
    "value": "20px"
  },
  {
    "comment": "Spacing — Mid region. Value: 24px. Mid region — marches in exact +4px increments; everyday component-internal and tighter between-element spacing.\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 24 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-120",
    "type": "number",
    "value": "24px"
  },
  {
    "comment": "Spacing — Mid region. Value: 28px. Mid region — marches in exact +4px increments; everyday component-internal and tighter between-element spacing.\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 28 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-130",
    "type": "number",
    "value": "28px"
  },
  {
    "comment": "Spacing — Mid region. Value: 32px. Mid region — marches in exact +4px increments; everyday component-internal and tighter between-element spacing.\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 32 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-140",
    "type": "number",
    "value": "32px"
  },
  {
    "comment": "Spacing — Mid region. Value: 36px. Mid region — marches in exact +4px increments; everyday component-internal and tighter between-element spacing.\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 36 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-150",
    "type": "number",
    "value": "36px"
  },
  {
    "comment": "Spacing — Mid region. Value: 40px. Mid region — marches in exact +4px increments; everyday component-internal and tighter between-element spacing.\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 40 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-160",
    "type": "number",
    "value": "40px"
  },
  {
    "comment": "Spacing — Mid region. Value: 44px. Mid region — marches in exact +4px increments; everyday component-internal and tighter between-element spacing.\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 44 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-170",
    "type": "number",
    "value": "44px"
  },
  {
    "comment": "Spacing — Mid region. Value: 48px. Mid region — marches in exact +4px increments; everyday component-internal and tighter between-element spacing.\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 48 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-180",
    "type": "number",
    "value": "48px"
  },
  {
    "comment": "Spacing — Mid region. Value: 52px. Mid region — marches in exact +4px increments; everyday component-internal and tighter between-element spacing.\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 52 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-190",
    "type": "number",
    "value": "52px"
  },
  {
    "comment": "Spacing — Fine region. Value: 2px. Fine region — advances in very small sub-4px increments; use where small differences are perceptible (component-internal detail, icon-to-label gaps, tight insets).\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 2 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-20",
    "type": "number",
    "value": "2px"
  },
  {
    "comment": "Spacing — Mid region. Value: 56px. Mid region — marches in exact +4px increments; everyday component-internal and tighter between-element spacing.\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 56 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-200",
    "type": "number",
    "value": "56px"
  },
  {
    "comment": "Spacing — Mid region. Value: 60px. Mid region — marches in exact +4px increments; everyday component-internal and tighter between-element spacing.\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 60 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-210",
    "type": "number",
    "value": "60px"
  },
  {
    "comment": "Spacing — Mid region. Value: 64px. Mid region — marches in exact +4px increments; everyday component-internal and tighter between-element spacing.\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 64 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-220",
    "type": "number",
    "value": "64px"
  },
  {
    "comment": "Spacing — Mid region. Value: 68px. Mid region — marches in exact +4px increments; everyday component-internal and tighter between-element spacing.\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 68 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-230",
    "type": "number",
    "value": "68px"
  },
  {
    "comment": "Spacing — Mid region. Value: 72px. Mid region — marches in exact +4px increments; everyday component-internal and tighter between-element spacing.\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 72 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-240",
    "type": "number",
    "value": "72px"
  },
  {
    "comment": "Spacing — Mid region. Value: 76px. Mid region — marches in exact +4px increments; everyday component-internal and tighter between-element spacing.\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 76 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-250",
    "type": "number",
    "value": "76px"
  },
  {
    "comment": "Spacing — Mid region. Value: 80px. Mid region — marches in exact +4px increments; everyday component-internal and tighter between-element spacing.\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 80 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-260",
    "type": "number",
    "value": "80px"
  },
  {
    "comment": "Spacing — Mid region. Value: 84px. Mid region — marches in exact +4px increments; everyday component-internal and tighter between-element spacing.\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 84 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-270",
    "type": "number",
    "value": "84px"
  },
  {
    "comment": "Spacing — Mid region. Value: 88px. Mid region — marches in exact +4px increments; everyday component-internal and tighter between-element spacing.\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 88 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-280",
    "type": "number",
    "value": "88px"
  },
  {
    "comment": "Spacing — Mid region. Value: 92px. Mid region — marches in exact +4px increments; everyday component-internal and tighter between-element spacing.\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 92 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-290",
    "type": "number",
    "value": "92px"
  },
  {
    "comment": "Spacing — Fine region. Value: 3px. Fine region — advances in very small sub-4px increments; use where small differences are perceptible (component-internal detail, icon-to-label gaps, tight insets).\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 3 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-30",
    "type": "number",
    "value": "3px"
  },
  {
    "comment": "Spacing — Mid region. Value: 96px. Mid region — marches in exact +4px increments; everyday component-internal and tighter between-element spacing.\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 96 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-300",
    "type": "number",
    "value": "96px"
  },
  {
    "comment": "Spacing — Mid region. Value: 100px. Mid region — marches in exact +4px increments; everyday component-internal and tighter between-element spacing.\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 100 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-310",
    "type": "number",
    "value": "100px"
  },
  {
    "comment": "Spacing — Coarse region. Value: 120px. Coarse region — takes larger jumps; section- and layout-level spacing where fine differences stop mattering. Steps here are lightly bound by components — they are part of the scale, drawn on where the relationship calls for a larger gap.\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 120 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-320",
    "type": "number",
    "value": "120px"
  },
  {
    "comment": "Spacing — Coarse region. Value: 132px. Coarse region — takes larger jumps; section- and layout-level spacing where fine differences stop mattering. Steps here are lightly bound by components — they are part of the scale, drawn on where the relationship calls for a larger gap.\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 132 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-330",
    "type": "number",
    "value": "132px"
  },
  {
    "comment": "Spacing — Fine region. Value: 4px. Fine region — advances in very small sub-4px increments; use where small differences are perceptible (component-internal detail, icon-to-label gaps, tight insets).\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 4 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-40",
    "type": "number",
    "value": "4px"
  },
  {
    "comment": "Spacing — Fine region. Value: 6px. Fine region — advances in very small sub-4px increments; use where small differences are perceptible (component-internal detail, icon-to-label gaps, tight insets).\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 6 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-50",
    "type": "number",
    "value": "6px"
  },
  {
    "comment": "Spacing — Fine region. Value: 7px. Fine region — advances in very small sub-4px increments; use where small differences are perceptible (component-internal detail, icon-to-label gaps, tight insets).\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 7 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-60",
    "type": "number",
    "value": "7px"
  },
  {
    "comment": "Spacing — Fine region. Value: 8px. Fine region — advances in very small sub-4px increments; use where small differences are perceptible (component-internal detail, icon-to-label gaps, tight insets).\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 8 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-70",
    "type": "number",
    "value": "8px"
  },
  {
    "comment": "Spacing — Fine region. Value: 10px. Fine region — advances in very small sub-4px increments; use where small differences are perceptible (component-internal detail, icon-to-label gaps, tight insets).\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 10 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-80",
    "type": "number",
    "value": "10px"
  },
  {
    "comment": "Spacing — Fine region. Value: 12px. Fine region — advances in very small sub-4px increments; use where small differences are perceptible (component-internal detail, icon-to-label gaps, tight insets).\n\nChoose by the relationship the space expresses: things that belong together take a tighter step; things that stand apart take a larger step. Move along the scale to set density — denser sits lower, more open sits higher. Between two steps, take the nearer. Never type the literal 12 — bind this variable. Not for fixed extents (height/width) — that is the sizing scale.\nApplied as: item-spacing (gap between sibling elements in an auto-layout frame) OR padding (per-side inset within an element — each side chosen independently). Between-element gaps: step is governed by the composition model, not chosen here. Within-element padding: chosen here by the relationship rule. Scoped to GAP.",
    "name": "spacing-90",
    "type": "number",
    "value": "12px"
  },
  {
    "name": "type-font-family-primary",
    "type": "fontFamily",
    "value": "Alfabet, sans-serif"
  },
  {
    "name": "type-font-family-secondary",
    "type": "fontFamily",
    "value": "\"Roboto Flex\", sans-serif"
  },
  {
    "name": "type-font-family-tertiary",
    "type": "fontFamily",
    "value": "\"Roboto Mono\", monospace"
  },
  {
    "name": "type-font-weight-body-bold",
    "type": "fontWeight",
    "value": 500
  },
  {
    "name": "type-font-weight-body-default",
    "type": "fontWeight",
    "value": 400
  },
  {
    "name": "type-font-weight-code-bold",
    "type": "fontWeight",
    "value": 500
  },
  {
    "name": "type-font-weight-code-default",
    "type": "fontWeight",
    "value": 400
  },
  {
    "name": "type-font-weight-display-regular",
    "type": "fontWeight",
    "value": 400
  },
  {
    "name": "type-font-weight-heading-bold",
    "type": "fontWeight",
    "value": 600
  },
  {
    "name": "type-font-weight-heading-default",
    "type": "fontWeight",
    "value": 500
  },
  {
    "name": "type-font-weight-heading-regular",
    "type": "fontWeight",
    "value": 400
  },
  {
    "name": "type-static-body-lg-font-size",
    "type": "number",
    "value": "17px"
  },
  {
    "name": "type-static-body-lg-line-height",
    "type": "number",
    "value": "26px"
  },
  {
    "name": "type-static-body-md-font-size",
    "type": "number",
    "value": "16px"
  },
  {
    "name": "type-static-body-md-line-height",
    "type": "number",
    "value": "24px"
  },
  {
    "name": "type-static-body-sm-compact-font-size",
    "type": "number",
    "value": "13px"
  },
  {
    "name": "type-static-body-sm-compact-line-height",
    "type": "number",
    "value": "20px"
  },
  {
    "name": "type-static-body-sm-font-size",
    "type": "number",
    "value": "14px"
  },
  {
    "name": "type-static-body-sm-line-height",
    "type": "number",
    "value": "20px"
  },
  {
    "name": "type-static-body-xl-font-size",
    "type": "number",
    "value": "19px"
  },
  {
    "name": "type-static-body-xl-line-height",
    "type": "number",
    "value": "28px"
  },
  {
    "name": "type-static-body-xs-font-size",
    "type": "number",
    "value": "12px"
  },
  {
    "name": "type-static-body-xs-line-height",
    "type": "number",
    "value": "18px"
  },
  {
    "name": "type-static-body-xxl-font-size",
    "type": "number",
    "value": "22px"
  },
  {
    "name": "type-static-body-xxl-line-height",
    "type": "number",
    "value": "32px"
  },
  {
    "name": "type-static-body-xxs-font-size",
    "type": "number",
    "value": "10px"
  },
  {
    "name": "type-static-body-xxs-line-height",
    "type": "number",
    "value": "16px"
  },
  {
    "name": "type-static-code-lg-font-size",
    "type": "number",
    "value": "17px"
  },
  {
    "name": "type-static-code-lg-line-height",
    "type": "number",
    "value": "26px"
  },
  {
    "name": "type-static-code-md-font-size",
    "type": "number",
    "value": "16px"
  },
  {
    "name": "type-static-code-md-line-height",
    "type": "number",
    "value": "24px"
  },
  {
    "name": "type-static-code-sm-font-size",
    "type": "number",
    "value": "14px"
  },
  {
    "name": "type-static-code-sm-line-height",
    "type": "number",
    "value": "20px"
  },
  {
    "name": "type-static-code-xl-font-size",
    "type": "number",
    "value": "19px"
  },
  {
    "name": "type-static-code-xl-line-height",
    "type": "number",
    "value": "28px"
  },
  {
    "name": "type-static-code-xs-font-size",
    "type": "number",
    "value": "12px"
  },
  {
    "name": "type-static-code-xs-line-height",
    "type": "number",
    "value": "18px"
  },
  {
    "name": "type-static-eyebrow-type-font-size",
    "type": "number",
    "value": "12px"
  },
  {
    "name": "type-static-eyebrow-type-line-height",
    "type": "number",
    "value": "18px"
  },
  {
    "name": "type-static-heading-lg-font-size",
    "type": "number",
    "value": "28px"
  },
  {
    "name": "type-static-heading-lg-line-height",
    "type": "number",
    "value": "34px"
  },
  {
    "name": "type-static-heading-md-font-size",
    "type": "number",
    "value": "24px"
  },
  {
    "name": "type-static-heading-md-line-height",
    "type": "number",
    "value": "30px"
  },
  {
    "name": "type-static-heading-sm-font-size",
    "type": "number",
    "value": "20px"
  },
  {
    "name": "type-static-heading-sm-line-height",
    "type": "number",
    "value": "24px"
  },
  {
    "name": "type-static-heading-xs-font-size",
    "type": "number",
    "value": "17px"
  },
  {
    "name": "type-static-heading-xs-line-height",
    "type": "number",
    "value": "20px"
  },
  {
    "name": "type-static-heading-xxs-font-size",
    "type": "number",
    "value": "14px"
  },
  {
    "name": "type-static-heading-xxs-line-height",
    "type": "number",
    "value": "18px"
  },
  {
    "name": "type-static-heading-xxxl-font-size",
    "type": "number",
    "value": "53px"
  },
  {
    "name": "type-static-heading-xxxl-line-height",
    "type": "number",
    "value": "60px"
  }
]