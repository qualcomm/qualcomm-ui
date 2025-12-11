// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * Timeline diagram styles using QDS tokens.
 * Source: mermaid/packages/mermaid/src/diagrams/timeline/styles.js
 */

export const timelineStyles = `
.edge {
  stroke-width: 3;
  fill: none;
}

.section--1 rect, .section--1 path, .section--1 circle, .section--1 path { fill: var(--color-category-blue-medium); }
.section--1 text { fill: var(--color-text-neutral-primary); }
.node-icon--1 { font-size: 40px; color: var(--color-text-neutral-primary); }
.section-edge--1 { stroke: var(--color-category-blue-medium); }

.section-0 rect, .section-0 path, .section-0 circle, .section-0 path { fill: var(--color-category-purple-medium); }
.section-0 text { fill: var(--color-text-neutral-primary); }
.node-icon-0 { font-size: 40px; color: var(--color-text-neutral-primary); }
.section-edge-0 { stroke: var(--color-category-purple-medium); }

.section-1 rect, .section-1 path, .section-1 circle, .section-1 path { fill: var(--color-category-green-medium); }
.section-1 text { fill: var(--color-text-neutral-primary); }
.node-icon-1 { font-size: 40px; color: var(--color-text-neutral-primary); }
.section-edge-1 { stroke: var(--color-category-green-medium); }

.section-2 rect, .section-2 path, .section-2 circle, .section-2 path { fill: var(--color-category-cyan-medium); }
.section-2 text { fill: var(--color-text-neutral-primary); }
.node-icon-2 { font-size: 40px; color: var(--color-text-neutral-primary); }
.section-edge-2 { stroke: var(--color-category-cyan-medium); }

.section-3 rect, .section-3 path, .section-3 circle, .section-3 path { fill: var(--color-category-orange-medium); }
.section-3 text { fill: var(--color-text-neutral-primary); }
.node-icon-3 { font-size: 40px; color: var(--color-text-neutral-primary); }
.section-edge-3 { stroke: var(--color-category-orange-medium); }

.section-4 rect, .section-4 path, .section-4 circle, .section-4 path { fill: var(--color-category-magenta-medium); }
.section-4 text { fill: var(--color-text-neutral-primary); }
.node-icon-4 { font-size: 40px; color: var(--color-text-neutral-primary); }
.section-edge-4 { stroke: var(--color-category-magenta-medium); }

.section-5 rect, .section-5 path, .section-5 circle, .section-5 path { fill: var(--color-category-teal-medium); }
.section-5 text { fill: var(--color-text-neutral-primary); }
.node-icon-5 { font-size: 40px; color: var(--color-text-neutral-primary); }
.section-edge-5 { stroke: var(--color-category-teal-medium); }

.section-6 rect, .section-6 path, .section-6 circle, .section-6 path { fill: var(--color-category-kiwi-medium); }
.section-6 text { fill: var(--color-text-neutral-primary); }
.node-icon-6 { font-size: 40px; color: var(--color-text-neutral-primary); }
.section-edge-6 { stroke: var(--color-category-kiwi-medium); }

.section-7 rect, .section-7 path, .section-7 circle, .section-7 path { fill: var(--color-category-red-medium); }
.section-7 text { fill: var(--color-text-neutral-primary); }
.node-icon-7 { font-size: 40px; color: var(--color-text-neutral-primary); }
.section-edge-7 { stroke: var(--color-category-red-medium); }

.section-root rect,
.section-root path,
.section-root circle {
  fill: var(--color-category-blue-medium);
}

.section-root text {
  fill: var(--color-text-neutral-primary);
}

.lineWrapper line {
  stroke: var(--color-text-neutral-primary);
}

.disabled,
.disabled circle,
.disabled text {
  fill: var(--color-utility-disabled-text);
}

.disabled text {
  fill: var(--color-utility-disabled-text);
}

.icon-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.eventWrapper {
  filter: brightness(120%);
}
`
