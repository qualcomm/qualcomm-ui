// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  FieldGroupErrorText,
  FieldGroupHint,
  FieldGroupItems,
  FieldGroupLabel,
  FieldGroupRoot,
  type FieldGroupRootProps,
} from "@qualcomm-ui/react/field-group"

export interface SwitchGroupProps extends FieldGroupRootProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children: ReactNode

  /**
   * Error message displayed when invalid.
   */
  errorText?: string

  /**
   * Helper text displayed below items.
   */
  hint?: string

  /**
   * Group label text.
   */
  label?: string
}

/**
 * Groups multiple switches with a label, hint, and error text.
 */
export function SwitchGroup({
  children,
  errorText,
  hint,
  label,
  ...props
}: SwitchGroupProps): ReactElement {
  const showHint = Boolean(hint) && !props.invalid
  const showError = Boolean(errorText) && props.invalid

  return (
    <FieldGroupRoot {...props}>
      {label && <FieldGroupLabel>{label}</FieldGroupLabel>}
      <FieldGroupItems>{children}</FieldGroupItems>
      {showHint && <FieldGroupHint>{hint}</FieldGroupHint>}
      {showError && <FieldGroupErrorText>{errorText}</FieldGroupErrorText>}
    </FieldGroupRoot>
  )
}

SwitchGroup.Root = FieldGroupRoot
SwitchGroup.Label = FieldGroupLabel
SwitchGroup.Items = FieldGroupItems
SwitchGroup.Hint = FieldGroupHint
SwitchGroup.ErrorText = FieldGroupErrorText
