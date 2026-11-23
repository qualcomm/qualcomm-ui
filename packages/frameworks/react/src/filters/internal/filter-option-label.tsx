// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {useQdsFilterControlContext} from "../qds-filter-control-context.js"

export interface FilterOptionLabelProps {
  /**
   * The option's result count. Omitted when the filter has no counts.
   */
  count: number | undefined

  label: string
}

/**
 * An option's label, followed by its result count when it has one.
 */
export function FilterOptionLabel({
  count,
  label,
}: FilterOptionLabelProps): ReactNode {
  const qdsContext = useQdsFilterControlContext()

  if (count === undefined) {
    return label
  }

  return (
    <span {...qdsContext.getOptionLabelBindings()}>
      <span>{label}</span>
      {/*
       * The leading space separates the count in the accessible name. It
       * collapses visually because the count is a flex item.
       */}
      <span {...qdsContext.getOptionCountBindings()}> {count}</span>
    </span>
  )
}
