// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {filterControlClasses} from "./filter-control.classes.js"

type FilterControlClasses = typeof filterControlClasses

/**
 * The size of filter controls. Every QDS form control supports these sizes.
 */
export type QdsFilterControlSize = "sm" | "md"

export interface QdsFilterControlApiProps {
  /**
   * The size of the filter controls.
   *
   * @default "sm"
   */
  size?: QdsFilterControlSize | undefined
}

export interface QdsFilterControlOptionCountBindings {
  className: FilterControlClasses["optionCount"]
}

export interface QdsFilterControlOptionGroupBindings {
  className: FilterControlClasses["optionGroup"]
  "data-size": QdsFilterControlSize
}

export interface QdsFilterControlOptionLabelBindings {
  className: FilterControlClasses["optionLabel"]
}

export interface QdsFilterControlStatusBindingsProps {
  status: "error" | "loading"
}

export interface QdsFilterControlStatusBindings {
  className: FilterControlClasses["status"]
  "data-size": QdsFilterControlSize
  "data-status": "error" | "loading"
}

export interface QdsFilterControlApi {
  /**
   * The size of the filter controls.
   */
  size: QdsFilterControlSize

  // group: bindings
  getOptionCountBindings(): QdsFilterControlOptionCountBindings
  getOptionGroupBindings(): QdsFilterControlOptionGroupBindings
  getOptionLabelBindings(): QdsFilterControlOptionLabelBindings
  getStatusBindings(
    props: QdsFilterControlStatusBindingsProps,
  ): QdsFilterControlStatusBindings
}
