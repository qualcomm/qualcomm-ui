// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {RadioControl, type RadioControlProps} from "./radio-control"
import {
  RadioHiddenInput,
  type RadioHiddenInputProps,
} from "./radio-hidden-input"
import {RadioLabel, type RadioLabelProps} from "./radio-label"
import {RadioRoot, type RadioRootProps} from "./radio-root"

export interface RadioProps extends RadioRootProps {
  /**
   * The simple Radio doesn't support children.
   */
  children?: never

  /**
   * Props applied to the control element.
   * @inheritDoc
   */
  controlProps?: RadioControlProps

  /**
   * Props applied to the hidden input element.
   * @inheritDoc
   */
  hiddenInputProps?: RadioHiddenInputProps

  /**
   * Optional label describing the element. Recommended. This element is
   * automatically associated with the component's input element for
   * accessibility.
   */
  label?: ReactNode

  /**
   * Props applied to the label element.
   * @inheritDoc
   */
  labelProps?: RadioLabelProps
}

export function Radio({
  controlProps,
  hiddenInputProps,
  label,
  labelProps,
  ...props
}: RadioProps): ReactElement {
  const labelContent = label || labelProps?.children
  return (
    <RadioRoot {...props}>
      <RadioHiddenInput {...hiddenInputProps} />
      <RadioControl {...controlProps} />
      {labelContent ? (
        <RadioLabel {...labelProps}>{labelContent}</RadioLabel>
      ) : null}
    </RadioRoot>
  )
}
