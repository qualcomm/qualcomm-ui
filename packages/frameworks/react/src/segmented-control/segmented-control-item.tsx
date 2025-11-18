// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {SegmentedControlHiddenInput} from "./segmented-control-hidden-input"
import {
  SegmentedControlItemRoot,
  type SegmentedControlItemRootProps,
} from "./segmented-control-item-root"
import {SegmentedControlItemText} from "./segmented-control-item-text"

export interface SegmentedControlItemProps
  extends SegmentedControlItemRootProps {
  /**
   * The simple component doesn't support children.
   */
  children?: never

  /**
   * The text for the item.
   */
  text?: ReactNode
}

export function SegmentedControlItem({
  text,
  ...props
}: SegmentedControlItemProps) {
  return (
    <SegmentedControlItemRoot {...props}>
      {text && <SegmentedControlItemText>{text}</SegmentedControlItemText>}
      <SegmentedControlHiddenInput />
    </SegmentedControlItemRoot>
  )
}
