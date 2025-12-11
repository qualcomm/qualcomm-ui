// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * Treemap diagram styles using QDS tokens.
 * Source: mermaid/packages/mermaid/src/diagrams/treemap/styles.ts
 */

export const treemapStyles = `
.treemapNode.section {
  stroke: var(--color-border-neutral-02);
  stroke-width: 1px;
  fill: var(--color-background-neutral-02);
}

.treemapNode.leaf {
  stroke: var(--color-border-neutral-03);
  stroke-width: 1px;
  fill: var(--color-background-neutral-03);
}

.treemapLabel {
  fill: var(--color-text-neutral-primary);
  font-size: var(--type-static-body-sm-font-size);
}

.treemapValue {
  fill: var(--color-text-neutral-secondary);
  font-size: var(--type-static-body-xs-font-size);
}

.treemapTitle {
  fill: var(--color-text-neutral-primary);
  font-size: var(--type-static-body-md-font-size);
}
`
