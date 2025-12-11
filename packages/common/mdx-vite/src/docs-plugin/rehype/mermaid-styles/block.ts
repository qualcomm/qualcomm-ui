// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * Block diagram styles using QDS tokens.
 * Source: mermaid/packages/mermaid/src/diagrams/block/styles.ts
 */

export const blockStyles = `
.label {
  
  color: var(--color-text-neutral-primary);
}

.cluster-label text {
  fill: var(--color-text-neutral-primary);
}

.cluster-label span,
.cluster-label p {
  color: var(--color-text-neutral-primary);
}

.label text,
.label span,
.label p {
  fill: var(--color-text-neutral-primary);
  color: var(--color-text-neutral-primary);
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

.flowchart-label text {
  text-anchor: middle;
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
  stroke-width: 2.0px;
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
  background-color: var(--color-background-neutral-01);
  fill: var(--color-background-neutral-01);
}

.labelBkg {
  background-color: var(--color-background-neutral-01);
}

.node .cluster {
  fill: var(--color-background-neutral-01);
  stroke: var(--color-border-neutral-01);
  box-shadow: var(--shadow-medium);
  stroke-width: 1px;
}

.cluster text {
  fill: var(--color-text-neutral-primary);
}

.cluster span,
.cluster p {
  color: var(--color-text-neutral-primary);
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

.flowchartTitleText {
  text-anchor: middle;
  font-size: 18px;
  fill: var(--color-text-neutral-primary);
}
`
