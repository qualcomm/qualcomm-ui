// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * Class diagram styles using QDS tokens.
 * Source: mermaid/packages/mermaid/src/diagrams/class/styles.js
 */

export const classStyles = `
g.classGroup text {
  fill: var(--color-border-neutral-02);
  stroke: none;
  font-family: var(--type-font-family-tertiary);
  font-size: 10px;
}

g.classGroup text .title {
  font-weight: bolder;
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

.nodeLabel,
.edgeLabel {
  color: var(--color-text-neutral-primary);
}

.edgeLabel .label rect {
  fill: var(--color-background-neutral-02);
}

.label text {
  fill: var(--color-text-neutral-primary);
}

.labelBkg {
  background: var(--color-background-neutral-02);
}

.edgeLabel .label span {
  background: var(--color-background-neutral-02);
}

.classTitle {
  font-weight: bolder;
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

.divider {
  stroke: var(--color-border-neutral-02);
  stroke-width: 1;
}

g.clickable {
  cursor: pointer;
}

g.classGroup rect {
  fill: var(--color-background-neutral-02);
  stroke: var(--color-border-neutral-02);
}

g.classGroup line {
  stroke: var(--color-border-neutral-02);
  stroke-width: 1;
}

.classLabel .box {
  stroke: none;
  stroke-width: 0;
  fill: var(--color-background-neutral-02);
  opacity: 0.5;
}

.classLabel .label {
  fill: var(--color-border-neutral-02);
  font-size: 10px;
}

.relation {
  stroke: var(--color-border-neutral-03);
  stroke-width: 1;
  fill: none;
}

.dashed-line {
  stroke-dasharray: 3;
}

.dotted-line {
  stroke-dasharray: 1 2;
}

#compositionStart,
.composition {
  fill: var(--color-border-neutral-03) !important;
  stroke: var(--color-border-neutral-03) !important;
  stroke-width: 1;
}

#compositionEnd,
.composition {
  fill: var(--color-border-neutral-03) !important;
  stroke: var(--color-border-neutral-03) !important;
  stroke-width: 1;
}

#dependencyStart,
.dependency {
  fill: var(--color-border-neutral-03) !important;
  stroke: var(--color-border-neutral-03) !important;
  stroke-width: 1;
}

#extensionStart,
.extension {
  fill: transparent !important;
  stroke: var(--color-border-neutral-03) !important;
  stroke-width: 1;
}

#extensionEnd,
.extension {
  fill: transparent !important;
  stroke: var(--color-border-neutral-03) !important;
  stroke-width: 1;
}

#aggregationStart,
.aggregation {
  fill: transparent !important;
  stroke: var(--color-border-neutral-03) !important;
  stroke-width: 1;
}

#aggregationEnd,
.aggregation {
  fill: transparent !important;
  stroke: var(--color-border-neutral-03) !important;
  stroke-width: 1;
}

#lollipopStart,
.lollipop {
  fill: var(--color-background-neutral-02) !important;
  stroke: var(--color-border-neutral-03) !important;
  stroke-width: 1;
}

#lollipopEnd,
.lollipop {
  fill: var(--color-background-neutral-02) !important;
  stroke: var(--color-border-neutral-03) !important;
  stroke-width: 1;
}

.edgeTerminals {
  font-size: 11px;
  line-height: initial;
}

.classTitleText {
  text-anchor: middle;
  font-size: 18px;
  fill: var(--color-text-neutral-primary);
}
`
