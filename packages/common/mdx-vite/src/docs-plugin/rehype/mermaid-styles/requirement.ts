// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * Requirement diagram styles using QDS tokens.
 * Source: mermaid/packages/mermaid/src/diagrams/requirement/styles.js
 */

export const requirementStyles = `
marker {
  fill: var(--color-border-neutral-03);
  stroke: var(--color-border-neutral-03);
}

marker.cross {
  stroke: var(--color-border-neutral-03);
}

svg {
  font-family: var(--type-font-family-tertiary);
  font-size: var(--type-static-body-sm-font-size);
}

.reqBox {
  fill: var(--color-background-neutral-02);
  fill-opacity: 1.0;
  stroke: var(--color-border-neutral-02);
  stroke-width: 1px;
}

.reqTitle,
.reqLabel {
  fill: var(--color-text-neutral-primary);
}

.reqLabelBox {
  fill: var(--color-background-neutral-01);
  fill-opacity: 1.0;
}

.req-title-line {
  stroke: var(--color-border-neutral-02);
  stroke-width: 1px;
}

.relationshipLine {
  stroke: var(--color-border-neutral-03);
  stroke-width: 1;
}

.relationshipLabel {
  fill: var(--color-text-neutral-primary);
}

.divider {
  stroke: var(--color-border-neutral-02);
  stroke-width: 1;
}

.label {
  font-family: var(--type-font-family-tertiary);
  color: var(--color-text-neutral-primary);
}

.label text,
.label span {
  fill: var(--color-text-neutral-primary);
  color: var(--color-text-neutral-primary);
}

.labelBkg {
  background-color: var(--color-background-neutral-01);
}
`
