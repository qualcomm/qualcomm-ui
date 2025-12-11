// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * Packet diagram styles using QDS tokens.
 * Source: mermaid/packages/mermaid/src/diagrams/packet/styles.ts
 */

export const packetStyles = `
.packetByte {
  font-size: var(--type-static-body-xs-font-size);
}

.packetByte.start {
  fill: var(--color-text-neutral-primary);
}

.packetByte.end {
  fill: var(--color-text-neutral-primary);
}

.packetLabel {
  fill: var(--color-text-neutral-primary);
  font-size: var(--type-static-body-sm-font-size);
}

.packetTitle {
  fill: var(--color-text-neutral-primary);
  font-size: var(--type-static-body-md-font-size);
}

.packetBlock {
  stroke: var(--color-border-neutral-02);
  stroke-width: 1px;
  fill: var(--color-background-neutral-02);
}
`
