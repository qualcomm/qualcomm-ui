// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * Sequence diagram styles using QDS tokens.
 * Source: mermaid/packages/mermaid/src/diagrams/sequence/styles.js
 */

export const sequenceStyles = `
.actor {
  stroke: var(--color-border-neutral-02);
  fill: var(--color-background-neutral-02);
}

text.actor > tspan {
  fill: var(--color-text-neutral-primary);
  stroke: none;
}

.actor-line {
  stroke: var(--color-border-neutral-03);
}

.innerArc {
  stroke-width: 1.5;
  stroke-dasharray: none;
}

.messageLine0 {
  stroke-width: 1.5;
  stroke-dasharray: none;
  stroke: var(--color-border-neutral-03);
}

.messageLine1 {
  stroke-width: 1.5;
  stroke-dasharray: 2, 2;
  stroke: var(--color-border-neutral-03);
}

#arrowhead path {
  fill: var(--color-border-neutral-03);
  stroke: var(--color-border-neutral-03);
}

.sequenceNumber {
  fill: var(--color-text-neutral-inverse);
}

#sequencenumber {
  fill: var(--color-border-neutral-03);
}

#crosshead path {
  fill: var(--color-border-neutral-03);
  stroke: var(--color-border-neutral-03);
}

.messageText {
  fill: var(--color-text-neutral-primary);
  stroke: none;
}

.labelBox {
  stroke: var(--color-border-neutral-02);
  fill: var(--color-background-neutral-02);
}

.labelText,
.labelText > tspan {
  fill: var(--color-text-neutral-primary);
  stroke: none;
}

.loopText,
.loopText > tspan {
  fill: var(--color-text-neutral-primary);
  stroke: none;
}

.loopLine {
  stroke-width: 2px;
  stroke-dasharray: 2, 2;
  stroke: var(--color-border-neutral-02);
  fill: var(--color-border-neutral-02);
}

.note {
  stroke: var(--color-border-support-info);
  fill: var(--color-background-support-info-subtle);
}

.noteText,
.noteText > tspan {
  fill: var(--color-text-neutral-primary);
  stroke: none;
}

.activation0 {
  fill: var(--color-background-neutral-03);
  stroke: var(--color-border-neutral-02);
}

.activation1 {
  fill: var(--color-background-neutral-03);
  stroke: var(--color-border-neutral-02);
}

.activation2 {
  fill: var(--color-background-neutral-03);
  stroke: var(--color-border-neutral-02);
}

.actorPopupMenu {
  position: absolute;
}

.actorPopupMenuPanel {
  position: absolute;
  fill: var(--color-background-neutral-02);
  box-shadow: var(--shadow-medium);
  filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));
}

.actor-man line {
  stroke: var(--color-border-neutral-02);
  fill: var(--color-background-neutral-02);
}

.actor-man circle,
.actor-man line {
  stroke: var(--color-border-neutral-02);
  fill: var(--color-background-neutral-02);
  stroke-width: 2px;
}
`
