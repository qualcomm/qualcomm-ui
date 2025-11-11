// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {Check} from "lucide-react"

import {Icon} from "@qualcomm-ui/react/icon"
import {
  CoreCombobox,
  type CoreComboboxItemIndicatorProps,
} from "@qualcomm-ui/react-core/combobox"

export interface ComboboxItemIndicatorProps
  extends CoreComboboxItemIndicatorProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   *
   * @default `<Icon icon={Check}/>`
   */
  children?: ReactNode
}

/**
 * Visual indicator showing the selected state of an item. Renders a `<span>`
 * element by default.
 */
export function ComboboxItemIndicator({
  children,
  ...props
}: ComboboxItemIndicatorProps): ReactElement {
  return (
    <CoreCombobox.ItemIndicator {...props}>
      {children ?? <Icon icon={Check} />}
    </CoreCombobox.ItemIndicator>
  )
}
