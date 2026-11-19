// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {useQdsFilterControlContext} from "../qds-filter-control-context.js"

import type {FilterOptionItem} from "./use-filter-options.js"

export interface FilterOptionLabelProps {
  option: FilterOptionItem
}

/**
 * An option's label, followed by its result count when it has one.
 */
export function FilterOptionLabel({option}: FilterOptionLabelProps): ReactNode {
  const qdsContext = useQdsFilterControlContext()

  if (option.count === undefined) {
    return option.label
  }

  return (
    <span {...qdsContext.getOptionLabelBindings()}>
      <span>{option.label}</span>
      {/*
       * The leading space separates the count in the accessible name. It
       * collapses visually because the count is a flex item.
       */}
      <span {...qdsContext.getOptionCountBindings()}> {option.count}</span>
    </span>
  )
}
