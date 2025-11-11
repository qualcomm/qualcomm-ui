// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import type {CheckboxElementIds} from "@qualcomm-ui/core/checkbox"
import {useOptionalContentId} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"

import {CheckboxControl, type CheckboxControlProps} from "./checkbox-control"
import {
  CheckboxErrorText,
  type CheckboxErrorTextProps,
} from "./checkbox-error-text"
import {
  CheckboxHiddenInput,
  type CheckboxHiddenInputProps,
} from "./checkbox-hidden-input"
import {
  CheckboxIndicator,
  type CheckboxIndicatorProps,
} from "./checkbox-indicator"
import {CheckboxLabel, type CheckboxLabelProps} from "./checkbox-label"
import {CheckboxRoot, type CheckboxRootProps} from "./checkbox-root"

export interface CheckboxProps extends CheckboxRootProps {
  /**
   * The simple Checkbox doesn't support children.
   */
  children?: never

  /**
   * Props applied to the control element.
   * @inheritDoc
   */
  controlProps?: CheckboxControlProps

  /**
   * Optional error that describes the element when {@link invalid} is true.
   */
  errorText?: string

  /**
   * Props applied to the error text element.
   * @inheritDoc
   */
  errorTextProps?: CheckboxErrorTextProps

  /**
   * Props applied to the hidden input element.
   * @inheritDoc
   */
  hiddenInputProps?: CheckboxHiddenInputProps

  /**
   * Props applied to the indicator element.
   * @inheritDoc
   */
  indicatorProps?: CheckboxIndicatorProps

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
  labelProps?: CheckboxLabelProps
}

export function Checkbox({
  controlProps,
  errorText,
  errorTextProps,
  hiddenInputProps,
  indicatorProps,
  label,
  labelProps,
  ...props
}: CheckboxProps): ReactElement {
  const labelContent = label || labelProps?.children
  const errorTextContent = errorText || errorTextProps?.children

  const ids: Partial<CheckboxElementIds> = {
    errorText: useOptionalContentId(errorTextContent, errorTextProps),
    hiddenInput: useControlledId(hiddenInputProps?.id),
    label: useOptionalContentId(labelContent, labelProps),
    root: useControlledId(props.id),
    ...props.ids,
  }

  return (
    <CheckboxRoot {...props} id={ids.root} ids={ids}>
      <CheckboxHiddenInput {...hiddenInputProps} id={ids.hiddenInput} />
      <CheckboxControl {...controlProps}>
        <CheckboxIndicator {...indicatorProps} />
      </CheckboxControl>
      {labelContent ? (
        <CheckboxLabel {...labelProps} id={ids.label}>
          {labelContent}
        </CheckboxLabel>
      ) : null}
      {errorTextContent ? (
        <CheckboxErrorText {...errorTextProps} id={ids.errorText}>
          {errorTextContent}
        </CheckboxErrorText>
      ) : null}
    </CheckboxRoot>
  )
}
