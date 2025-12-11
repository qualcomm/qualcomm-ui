// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * Gantt diagram styles using QDS tokens.
 * Source: mermaid/packages/mermaid/src/diagrams/gantt/styles.js
 */

export const ganttStyles = `
.mermaid-main-font {
  
}

.exclude-range {
  fill: var(--color-background-neutral-03);
}

.section {
  stroke: none;
  opacity: 0.2;
}

.section0 {
  fill: var(--color-category-blue-subtle);
}

.section2 {
  fill: var(--color-category-blue-subtle);
}

.section1,
.section3 {
  fill: var(--color-category-purple-subtle);
  opacity: 0.2;
}

.sectionTitle0,
.sectionTitle1,
.sectionTitle2,
.sectionTitle3 {
  fill: var(--color-text-neutral-primary);
}

.sectionTitle {
  text-anchor: start;
  
}

.grid .tick {
  stroke: var(--color-border-neutral-01);
  opacity: 0.8;
  shape-rendering: crispEdges;
}

.grid .tick text {
  
  fill: var(--color-text-neutral-primary);
}

.grid path {
  stroke-width: 0;
}

.today {
  fill: none;
  stroke: var(--color-border-support-danger);
  stroke-width: 2px;
}

.task {
  stroke-width: 2;
}

.taskText {
  text-anchor: middle;
  
}

.taskTextOutsideRight {
  fill: var(--color-text-neutral-primary);
  text-anchor: start;
  
}

.taskTextOutsideLeft {
  fill: var(--color-text-neutral-primary);
  text-anchor: end;
}

.task.clickable {
  cursor: pointer;
}

.taskText.clickable {
  cursor: pointer;
  fill: var(--color-interactive-text-link-default-idle) !important;
  font-weight: bold;
}

.taskTextOutsideLeft.clickable {
  cursor: pointer;
  fill: var(--color-interactive-text-link-default-idle) !important;
  font-weight: bold;
}

.taskTextOutsideRight.clickable {
  cursor: pointer;
  fill: var(--color-interactive-text-link-default-idle) !important;
  font-weight: bold;
}

.taskText0,
.taskText1,
.taskText2,
.taskText3 {
  fill: var(--color-text-neutral-primary);
}

.task0,
.task1,
.task2,
.task3 {
  fill: var(--color-category-blue-medium);
  stroke: var(--color-category-blue-strong);
}

.taskTextOutside0,
.taskTextOutside1,
.taskTextOutside2,
.taskTextOutside3 {
  fill: var(--color-text-neutral-primary);
}

.active0,
.active1,
.active2,
.active3 {
  fill: var(--color-category-cyan-medium);
  stroke: var(--color-category-cyan-strong);
}

.activeText0,
.activeText1,
.activeText2,
.activeText3 {
  fill: var(--color-text-neutral-primary) !important;
}

.done0,
.done1,
.done2,
.done3 {
  stroke: var(--color-category-green-strong);
  fill: var(--color-category-green-medium);
  stroke-width: 2;
}

.doneText0,
.doneText1,
.doneText2,
.doneText3 {
  fill: var(--color-text-neutral-primary) !important;
}

.crit0,
.crit1,
.crit2,
.crit3 {
  stroke: var(--color-category-red-strong);
  fill: var(--color-category-red-medium);
  stroke-width: 2;
}

.activeCrit0,
.activeCrit1,
.activeCrit2,
.activeCrit3 {
  stroke: var(--color-category-red-strong);
  fill: var(--color-category-cyan-medium);
  stroke-width: 2;
}

.doneCrit0,
.doneCrit1,
.doneCrit2,
.doneCrit3 {
  stroke: var(--color-category-red-strong);
  fill: var(--color-category-green-medium);
  stroke-width: 2;
  cursor: pointer;
  shape-rendering: crispEdges;
}

.milestone {
  transform: rotate(45deg) scale(0.8, 0.8);
}

.milestoneText {
  font-style: italic;
}

.doneCritText0,
.doneCritText1,
.doneCritText2,
.doneCritText3 {
  fill: var(--color-text-neutral-primary) !important;
}

.vert {
  stroke: var(--color-border-neutral-02);
}

.vertText {
  font-size: 15px;
  text-anchor: middle;
  fill: var(--color-border-neutral-02) !important;
}

.activeCritText0,
.activeCritText1,
.activeCritText2,
.activeCritText3 {
  fill: var(--color-text-neutral-primary) !important;
}

.titleText {
  text-anchor: middle;
  font-size: 18px;
  fill: var(--color-text-neutral-primary);
  
}
`
