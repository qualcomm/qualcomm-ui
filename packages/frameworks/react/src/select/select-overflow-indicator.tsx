// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Tag} from "@qualcomm-ui/react/tag"
import {useSelectContext} from "@qualcomm-ui/react-core/select"

import {useQdsSelectContext} from "./qds-select-context"

export interface SelectOverflowIndicatorProps {
  /**
   * Number of hidden/overflowing items
   */
  count: number
}

/**
 * Displays an indicator showing the count of hidden tags when using overflow
 * detection in multiple selection mode. Clicking opens the dropdown.
 */
export function SelectOverflowIndicator({
  count,
}: SelectOverflowIndicatorProps): ReactElement {
  const {disabled, setOpen} = useSelectContext()
  const qdsContext = useQdsSelectContext()

  const handleClick = (event: React.MouseEvent) => {
    if (disabled) {
      return
    }
    event.stopPropagation()
    setOpen(true)
  }

  return (
    <button
      type="button"
      {...qdsContext.getOverflowIndicatorBindings()}
      aria-disabled={disabled || undefined}
      aria-label={`${count} more item${count === 1 ? "" : "s"} selected, click to view`}
      onClick={handleClick}
    >
      <Tag emphasis="neutral">+{count}</Tag>
    </button>
  )
}
