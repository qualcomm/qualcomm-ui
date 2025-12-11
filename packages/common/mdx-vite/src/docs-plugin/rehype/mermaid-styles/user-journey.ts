// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * User journey diagram styles using QDS tokens.
 * Source: mermaid/packages/mermaid/src/diagrams/user-journey/styles.js
 */

export const userJourneyStyles = `
.label {
  
  color: var(--color-text-neutral-primary);
}

.mouth {
  stroke: var(--color-border-neutral-03);
}

line {
  stroke: var(--color-text-neutral-primary);
}

.legend {
  fill: var(--color-text-neutral-primary);
  
}

.label text {
  fill: var(--color-text-neutral-primary);
}

.face {
  fill: var(--color-background-neutral-10);
  stroke: var(--color-border-neutral-03);
}

.node rect,
.node circle,
.node ellipse,
.node polygon,
.node path {
  fill: var(--color-background-neutral-02);
  stroke: var(--color-border-neutral-02);
  stroke-width: 1px;
}

.node .label {
  text-align: center;
}

.node.clickable {
  cursor: pointer;
}

.arrowheadPath {
  fill: var(--color-border-neutral-03);
}

.edgePath .path {
  stroke: var(--color-border-neutral-03);
  stroke-width: 1.5px;
}

.flowchart-link {
  stroke: var(--color-border-neutral-03);
  fill: none;
}

.edgeLabel {
  background-color: var(--color-background-neutral-01);
}

.edgeLabel rect {
  opacity: 0.5;
}

.cluster text {
  fill: var(--color-text-neutral-primary);
}

div.mermaidTooltip {
  position: absolute;
  text-align: center;
  max-width: 200px;
  padding: 2px;
  
  font-size: 12px;
  background: var(--color-background-neutral-03);
  border: 1px solid var(--color-border-neutral-02);
  border-radius: var(--border-radius-sm);
  pointer-events: none;
  z-index: 100;
}

.task-type-0, .section-type-0 { fill: var(--color-category-blue-medium); }
.task-type-1, .section-type-1 { fill: var(--color-category-purple-medium); }
.task-type-2, .section-type-2 { fill: var(--color-category-green-medium); }
.task-type-3, .section-type-3 { fill: var(--color-category-cyan-medium); }
.task-type-4, .section-type-4 { fill: var(--color-category-orange-medium); }
.task-type-5, .section-type-5 { fill: var(--color-category-magenta-medium); }
.task-type-6, .section-type-6 { fill: var(--color-category-teal-medium); }
.task-type-7, .section-type-7 { fill: var(--color-category-kiwi-medium); }

.actor-0 { fill: var(--color-category-blue-medium); }
.actor-1 { fill: var(--color-category-purple-medium); }
.actor-2 { fill: var(--color-category-green-medium); }
.actor-3 { fill: var(--color-category-cyan-medium); }
.actor-4 { fill: var(--color-category-orange-medium); }
.actor-5 { fill: var(--color-category-magenta-medium); }
`
