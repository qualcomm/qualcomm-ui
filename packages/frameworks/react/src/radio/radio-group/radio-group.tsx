// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {RadioGroupItems, type RadioGroupItemsProps} from "./radio-group-items"
import {RadioGroupLabel, type RadioGroupLabelProps} from "./radio-group-label"
import {
  RadioGroupRoot,
  type RadioGroupRootProps as RadioGroupRootProps,
} from "./radio-group-root"

export interface RadioGroupProps extends RadioGroupRootProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * Props applied to the items element.
   */
  itemsProps?: RadioGroupItemsProps

  /**
   * Optional label describing the radio group. Recommended for accessibility.
   */
  label?: ReactNode

  /**
   * Props applied to the label element.
   */
  labelProps?: RadioGroupLabelProps
}

export function RadioGroup({
  children,
  itemsProps,
  label,
  labelProps,
  ...props
}: RadioGroupProps): ReactElement {
  const labelContent = label || labelProps?.children
  return (
    <RadioGroupRoot {...(props as RadioGroupRootProps)}>
      {labelContent ? (
        <RadioGroupLabel {...labelProps}>{labelContent}</RadioGroupLabel>
      ) : null}
      <RadioGroupItems {...itemsProps}>{children}</RadioGroupItems>
    </RadioGroupRoot>
  )
}
