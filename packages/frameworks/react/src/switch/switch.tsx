// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useOptionalContentId} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"

import {SwitchControl, type SwitchControlProps} from "./switch-control.js"
import {
  SwitchErrorText,
  type SwitchErrorTextProps,
} from "./switch-error-text.js"
import {
  SwitchHiddenInput,
  type SwitchHiddenInputProps,
} from "./switch-hidden-input.js"
import {SwitchHint, type SwitchHintProps} from "./switch-hint.js"
import {SwitchLabel, type SwitchLabelProps} from "./switch-label.js"
import {SwitchRoot, type SwitchRootProps} from "./switch-root.js"
import {SwitchThumb, type SwitchThumbProps} from "./switch-thumb.js"

export interface SwitchProps extends SwitchRootProps {
  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label aria-label}
   * attribute, forwarded to the hidden input element.
   */
  "aria-label"?: string | undefined

  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby aria-labelledby}
   * attribute, forwarded to the hidden input element. If you provide a {@link
   * label}, omit this prop.
   */
  "aria-labelledby"?: string | undefined

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
   * Optional hint text that describes the element.
   */
  hint?: ReactNode

  /**
   * Props applied to the hint element.
   */
  hintProps?: SwitchHintProps

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
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  controlProps,
  errorText,
  errorTextProps,
  hiddenInputProps: hiddenInputPropsProp,
  hint,
  hintProps,
  label,
  labelProps,
  thumbProps,
  ...props
}: SwitchProps): ReactElement {
  const labelContent = label || labelProps?.children
  const errorTextContent = errorText || errorTextProps?.children
  const hintContent = hint || hintProps?.children

  const hiddenInputProps = {
    ...hiddenInputPropsProp,
  }

  if (ariaLabel !== undefined) {
    hiddenInputProps["aria-label"] = ariaLabel
  }
  if (ariaLabelledBy !== undefined) {
    hiddenInputProps["aria-labelledby"] = ariaLabelledBy
  }

  const ids = {
    errorText: useOptionalContentId(errorTextContent, errorTextProps),
    hiddenInput: useControlledId(hiddenInputProps?.id),
    hint: useOptionalContentId(hintContent, hintProps),
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
      {hintContent ? (
        <SwitchHint {...hintProps} id={ids.hint}>
          {hintContent}
        </SwitchHint>
      ) : null}
      {errorTextContent ? (
        <SwitchErrorText {...errorTextProps} id={ids.errorText}>
          {errorTextContent}
        </SwitchErrorText>
      ) : null}
    </SwitchRoot>
  )
}
