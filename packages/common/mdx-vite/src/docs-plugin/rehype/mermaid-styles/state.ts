// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * State diagram styles using QDS tokens.
 * Source: mermaid/packages/mermaid/src/diagrams/state/styles.js
 */

export const stateStyles = `
defs #statediagram-barbEnd {
  fill: var(--color-border-neutral-03);
  stroke: var(--color-border-neutral-03);
}

g.stateGroup text {
  fill: var(--color-text-neutral-primary);
  stroke: none;
  font-size: 10px;
}

g.stateGroup .state-title {
  font-weight: bolder;
  fill: var(--color-text-neutral-primary);
}

g.stateGroup rect {
  fill: var(--color-background-neutral-02);
  stroke: var(--color-border-neutral-02);
}

g.stateGroup line {
  stroke: var(--color-border-neutral-03);
  stroke-width: 1;
}

.transition {
  stroke: var(--color-border-neutral-03);
  stroke-width: 1;
  fill: none;
}

.stateGroup .composit {
  fill: var(--color-background-neutral-01);
  border-bottom: 1px;
}

.stateGroup .alt-composit {
  fill: var(--color-background-neutral-03);
  border-bottom: 1px;
}

.state-note {
  stroke: var(--color-border-support-info);
  fill: var(--color-background-support-info-subtle);
}

.state-note text {
  fill: var(--color-text-neutral-primary);
  stroke: none;
  font-size: 10px;
}

.stateLabel .box {
  stroke: none;
  stroke-width: 0;
  fill: var(--color-background-neutral-02);
  opacity: 0.5;
}

.edgeLabel .label rect {
  fill: var(--color-background-neutral-01);
  opacity: 0.5;
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

.edgeLabel .label text {
  fill: var(--color-text-neutral-secondary);
}

.label div .edgeLabel {
  color: var(--color-text-neutral-secondary);
}

.stateLabel text {
  fill: var(--color-text-neutral-primary);
  font-size: 10px;
  font-weight: bold;
}

.node circle.state-start {
  fill: var(--color-text-neutral-primary);
  stroke: var(--color-text-neutral-primary);
}

.node .fork-join {
  fill: var(--color-text-neutral-primary);
  stroke: var(--color-text-neutral-primary);
}

.node circle.state-end {
  fill: var(--color-background-neutral-02);
  stroke: var(--color-background-neutral-01);
  stroke-width: 1.5;
}

.end-state-inner {
  fill: var(--color-background-neutral-01);
  stroke-width: 1.5;
}

.node rect {
  fill: var(--color-background-neutral-02);
  stroke: var(--color-border-neutral-02);
  stroke-width: 1px;
}

.node polygon {
  fill: var(--color-background-neutral-02);
  stroke: var(--color-border-neutral-02);
  stroke-width: 1px;
}

#statediagram-barbEnd {
  fill: var(--color-border-neutral-03);
}

.statediagram-cluster rect {
  fill: var(--color-background-neutral-01);
  stroke: var(--color-border-neutral-02);
  stroke-width: 1px;
}

.cluster-label,
.nodeLabel {
  color: var(--color-text-neutral-primary);
}

.statediagram-cluster rect.outer {
  rx: 5px;
  ry: 5px;
}

.statediagram-state .divider {
  stroke: var(--color-border-neutral-02);
}

.statediagram-state .title-state {
  rx: 5px;
  ry: 5px;
}

.statediagram-cluster.statediagram-cluster .inner {
  fill: var(--color-background-neutral-01);
}

.statediagram-cluster.statediagram-cluster-alt .inner {
  fill: var(--color-background-neutral-03);
}

.statediagram-cluster .inner {
  rx: 0;
  ry: 0;
}

.statediagram-state rect.basic {
  rx: 5px;
  ry: 5px;
}

.statediagram-state rect.divider {
  stroke-dasharray: 10, 10;
  fill: var(--color-background-neutral-03);
}

.note-edge {
  stroke-dasharray: 5;
}

.statediagram-note rect {
  fill: var(--color-background-support-info-subtle);
  stroke: var(--color-border-support-info);
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}

.statediagram-note text {
  fill: var(--color-text-neutral-primary);
}

.statediagram-note .nodeLabel {
  color: var(--color-text-neutral-primary);
}

#dependencyStart,
#dependencyEnd {
  fill: var(--color-border-neutral-03);
  stroke: var(--color-border-neutral-03);
  stroke-width: 1;
}

.statediagramTitleText {
  text-anchor: middle;
  font-size: 18px;
  fill: var(--color-text-neutral-primary);
}
`;
