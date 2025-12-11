// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * Git graph styles using QDS tokens.
 * Source: mermaid/packages/mermaid/src/diagrams/git/styles.js
 */

export const gitStyles = `
.commit-id,
.commit-msg,
.branch-label {
  fill: var(--color-text-neutral-secondary);
  color: var(--color-text-neutral-secondary);
  font-family: var(--type-font-family-tertiary);
}

.branch-label0 { fill: var(--color-category-blue-strong); }
.commit0 { stroke: var(--color-category-blue-medium); fill: var(--color-category-blue-medium); }
.commit-highlight0 { stroke: var(--color-category-blue-subtle); fill: var(--color-category-blue-subtle); }
.label0 { fill: var(--color-category-blue-medium); }
.arrow0 { stroke: var(--color-category-blue-medium); }

.branch-label1 { fill: var(--color-category-purple-strong); }
.commit1 { stroke: var(--color-category-purple-medium); fill: var(--color-category-purple-medium); }
.commit-highlight1 { stroke: var(--color-category-purple-subtle); fill: var(--color-category-purple-subtle); }
.label1 { fill: var(--color-category-purple-medium); }
.arrow1 { stroke: var(--color-category-purple-medium); }

.branch-label2 { fill: var(--color-category-green-strong); }
.commit2 { stroke: var(--color-category-green-medium); fill: var(--color-category-green-medium); }
.commit-highlight2 { stroke: var(--color-category-green-subtle); fill: var(--color-category-green-subtle); }
.label2 { fill: var(--color-category-green-medium); }
.arrow2 { stroke: var(--color-category-green-medium); }

.branch-label3 { fill: var(--color-category-cyan-strong); }
.commit3 { stroke: var(--color-category-cyan-medium); fill: var(--color-category-cyan-medium); }
.commit-highlight3 { stroke: var(--color-category-cyan-subtle); fill: var(--color-category-cyan-subtle); }
.label3 { fill: var(--color-category-cyan-medium); }
.arrow3 { stroke: var(--color-category-cyan-medium); }

.branch-label4 { fill: var(--color-category-orange-strong); }
.commit4 { stroke: var(--color-category-orange-medium); fill: var(--color-category-orange-medium); }
.commit-highlight4 { stroke: var(--color-category-orange-subtle); fill: var(--color-category-orange-subtle); }
.label4 { fill: var(--color-category-orange-medium); }
.arrow4 { stroke: var(--color-category-orange-medium); }

.branch-label5 { fill: var(--color-category-magenta-strong); }
.commit5 { stroke: var(--color-category-magenta-medium); fill: var(--color-category-magenta-medium); }
.commit-highlight5 { stroke: var(--color-category-magenta-subtle); fill: var(--color-category-magenta-subtle); }
.label5 { fill: var(--color-category-magenta-medium); }
.arrow5 { stroke: var(--color-category-magenta-medium); }

.branch-label6 { fill: var(--color-category-teal-strong); }
.commit6 { stroke: var(--color-category-teal-medium); fill: var(--color-category-teal-medium); }
.commit-highlight6 { stroke: var(--color-category-teal-subtle); fill: var(--color-category-teal-subtle); }
.label6 { fill: var(--color-category-teal-medium); }
.arrow6 { stroke: var(--color-category-teal-medium); }

.branch-label7 { fill: var(--color-category-kiwi-strong); }
.commit7 { stroke: var(--color-category-kiwi-medium); fill: var(--color-category-kiwi-medium); }
.commit-highlight7 { stroke: var(--color-category-kiwi-subtle); fill: var(--color-category-kiwi-subtle); }
.label7 { fill: var(--color-category-kiwi-medium); }
.arrow7 { stroke: var(--color-category-kiwi-medium); }

.branch {
  stroke-width: 1;
  stroke: var(--color-border-neutral-03);
  stroke-dasharray: 2;
}

.commit-label {
  font-size: var(--type-static-body-xs-font-size);
  fill: var(--color-text-neutral-primary);
}

.commit-label-bkg {
  font-size: var(--type-static-body-xs-font-size);
  fill: var(--color-background-neutral-02);
  opacity: 0.5;
}

.tag-label {
  font-size: var(--type-static-body-xs-font-size);
  fill: var(--color-text-neutral-primary);
}

.tag-label-bkg {
  fill: var(--color-background-neutral-03);
  stroke: var(--color-border-neutral-02);
}

.tag-hole {
  fill: var(--color-text-neutral-primary);
}

.commit-merge {
  stroke: var(--color-background-brand-primary);
  fill: var(--color-background-brand-primary);
}

.commit-reverse {
  stroke: var(--color-background-brand-primary);
  fill: var(--color-background-brand-primary);
  stroke-width: 3;
}

.commit-highlight-inner {
  stroke: var(--color-background-brand-primary);
  fill: var(--color-background-brand-primary);
}

.arrow {
  stroke-width: 8;
  stroke-linecap: round;
  fill: none;
}

.gitTitleText {
  text-anchor: middle;
  font-size: 18px;
  fill: var(--color-text-neutral-primary);
}
`
