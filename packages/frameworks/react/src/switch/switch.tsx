// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useOptionalContentId} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"

import {SwitchControl, type SwitchControlProps} from "./switch-control"
import {SwitchErrorText, type SwitchErrorTextProps} from "./switch-error-text"
import {
  SwitchHiddenInput,
  type SwitchHiddenInputProps,
} from "./switch-hidden-input"
import {SwitchLabel, type SwitchLabelProps} from "./switch-label"
import {SwitchRoot, type SwitchRootProps} from "./switch-root"
import {SwitchThumb, type SwitchThumbProps} from "./switch-thumb"

export interface SwitchProps extends SwitchRootProps {
  /**
   * The simple Switch doesn't support children.
   */
  children?: never

  /**
   * Props applied to the control element.
   */
  controlProps?: SwitchControlProps

  /**
   * Optional error that describes the element when {@link invalid} is true.
   */
  errorText?: string

  /**
   * Props applied to the error text element.
   */
  errorTextProps?: SwitchErrorTextProps

  /**
   * Props applied to the hidden input element.
   */
  hiddenInputProps?: SwitchHiddenInputProps

  /**
   * Optional label describing the element. Recommended. This element is
   * automatically associated with the component's input element for
   * accessibility.
   */
  label?: ReactNode

  /**
   * Props applied to the label element.
   */
  labelProps?: SwitchLabelProps

  /**
   * Props applied to the thumb element.
   */
  thumbProps?: SwitchThumbProps
}

export function Switch({
  controlProps,
  errorText,
  errorTextProps,
  hiddenInputProps,
  label,
  labelProps,
  thumbProps,
  ...props
}: SwitchProps): ReactElement {
  const labelContent = label || labelProps?.children
  const errorTextContent = errorText || errorTextProps?.children

  const ids = {
    errorText: useOptionalContentId(errorTextContent, errorTextProps),
    hiddenInput: useControlledId(hiddenInputProps?.id),
    label: useOptionalContentId(labelContent, labelProps),
    root: useControlledId(props.id),
    ...props.ids,
  }

  return (
    <SwitchRoot {...props} ids={ids}>
      <SwitchHiddenInput {...hiddenInputProps} id={ids.hiddenInput} />
      <SwitchControl {...controlProps}>
        <SwitchThumb {...thumbProps} />
      </SwitchControl>
      {labelContent ? (
        <SwitchLabel {...labelProps} id={ids.label}>
          {labelContent}
        </SwitchLabel>
      ) : null}
      {errorTextContent ? (
        <SwitchErrorText {...errorTextProps} id={ids.errorText}>
          {errorTextContent}
        </SwitchErrorText>
      ) : null}
    </SwitchRoot>
  )
}
