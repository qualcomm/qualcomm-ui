// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * Flowchart diagram styles using QDS tokens.
 * Source: mermaid/packages/mermaid/src/diagrams/flowchart/styles.ts
 */

export const flowchartStyles = `
.label {
  color: var(--color-text-neutral-primary);
}

.cluster-label text {
  fill: var(--color-text-neutral-primary);
}

.cluster-label span {
  color: var(--color-text-neutral-primary);
}

.cluster-label span p {
  background-color: transparent;
}

.label text,
.label span {
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

.rough-node .label text,
.node .label text,
.image-shape .label,
.icon-shape .label {
  text-anchor: middle;
}

.node .katex path {
  fill: var(--color-text-neutral-primary);
  stroke: var(--color-text-neutral-primary);
  stroke-width: 1px;
}

.rough-node .label,
.node .label,
.image-shape .label,
.icon-shape .label {
  text-align: center;
}

.node.clickable {
  cursor: pointer;
}

.root .anchor path {
  fill: var(--color-border-neutral-03) !important;
  stroke-width: 0;
  stroke: var(--color-border-neutral-03);
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

.edgeLabel p {
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

.cluster rect {
  fill: var(--color-background-neutral-01);
  stroke: var(--color-border-neutral-01);
  stroke-width: 1px;
}

.cluster text {
  fill: var(--color-text-neutral-primary);
}

.cluster span {
  color: var(--color-text-neutral-primary);
}

div.mermaidTooltip {
  position: absolute;
  text-align: center;
  max-width: 200px;
  padding: 2px;
  font-family: var(--type-font-family-tertiary);
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

rect.text {
  fill: none;
  stroke-width: 0;
}

.icon-shape,
.image-shape {
  background-color: var(--color-background-neutral-01);
}

.icon-shape p,
.image-shape p {
  background-color: var(--color-background-neutral-01);
  padding: 2px;
}

.icon-shape rect,
.image-shape rect {
  opacity: 0.5;
  background-color: var(--color-background-neutral-01);
  fill: var(--color-background-neutral-01);
}
`
