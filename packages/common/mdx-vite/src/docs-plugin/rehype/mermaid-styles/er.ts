// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * ER diagram styles using QDS tokens.
 * Source: mermaid/packages/mermaid/src/diagrams/er/styles.ts
 */

export const erStyles = `
.entityBox {
  fill: var(--color-background-neutral-02);
  stroke: var(--color-border-neutral-02);
}

.relationshipLabelBox {
  fill: var(--color-background-neutral-03);
  opacity: 0.7;
  background-color: var(--color-background-neutral-03);
}

.relationshipLabelBox rect {
  opacity: 0.5;
}

.labelBkg {
  background-color: var(--color-background-neutral-03);
}

.edgeLabel .label {
  fill: var(--color-border-neutral-02);
  font-size: 14px;
}

.label {
  
  color: var(--color-text-neutral-primary);
}

.edge-pattern-dashed {
  stroke-dasharray: 8, 8;
}

.node rect,
.node circle,
.node ellipse,
.node polygon {
  fill: var(--color-background-neutral-02);
  stroke: var(--color-border-neutral-02);
  stroke-width: 1px;
}

.relationshipLine {
  stroke: var(--color-border-neutral-03);
  stroke-width: 1;
  fill: none;
}

.marker {
  fill: none !important;
  stroke: var(--color-border-neutral-03) !important;
  stroke-width: 1;
}
`
