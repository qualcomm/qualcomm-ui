// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useOptionalContentId} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"

import {
  TextAreaCounter,
  type TextAreaCounterProps,
} from "./text-area-counter.js"
import {
  TextAreaErrorText,
  type TextAreaErrorTextProps,
} from "./text-area-error-text.js"
import {TextAreaHint, type TextAreaHintProps} from "./text-area-hint.js"
import {TextAreaInput, type TextAreaInputProps} from "./text-area-input.js"
import {TextAreaLabel, type TextAreaLabelProps} from "./text-area-label.js"
import {TextAreaRoot, type TextAreaRootProps} from "./text-area-root.js"

export interface TextAreaProps extends TextAreaRootProps {
  /**
   * The simple TextArea doesn't support children.
   */
  children?: never

  /**
   * Controls whether to display the counter element.
   *
   * - `true`: always show the counter
   * - `false`: never show the counter
   * - `undefined` (default): only show the counter if `maxLength` is set
   */
  counter?: boolean

  /**
   * Props applied to the counter element.
   */
  counterProps?: TextAreaCounterProps

  /**
   * Optional error that describes the element when {@link invalid} is true.
   */
  errorText?: string

  /**
   * Props applied to the error text element.
   */
  errorTextProps?: TextAreaErrorTextProps

  /**
   * Optional hint describing the element. This element is automatically
   * associated with the component's textarea element for accessibility.
   */
  hint?: ReactNode

  /**
   * Props applied to the hint element.
   */
  hintProps?: TextAreaHintProps

  /**
   * Props applied to the textarea element.
   */
  inputProps?: TextAreaInputProps

  /**
   * Optional label describing the element. Recommended. This element is
   * automatically associated with the component's input element for
   * accessibility.
   */
  label?: ReactNode

  /**
   * Props applied to the label element.
   */
  labelProps?: TextAreaLabelProps

  /**
   * HTML {@link https://www.w3schools.com/tags/att_input_maxlength.asp maxlength} attribute,
   * passed to the underlying textarea element.
   */
  maxLength?: number

  /**
   * HTML {@link https://www.w3schools.com/tags/att_input_placeholder.asp placeholder} attribute,
   * passed to the underlying textarea element.
   */
  placeholder?: string
}

export function TextArea({
  counter,
  counterProps,
  errorText,
  errorTextProps,
  hint,
  hintProps,
  inputProps,
  label,
  labelProps,
  maxLength,
  placeholder,
  ...props
}: TextAreaProps): ReactElement {
  const labelContent = label || labelProps?.children
  const errorTextContent = errorText || errorTextProps?.children
  const hintContent = hint || hintProps?.children

  const ids = {
    counter: useControlledId(counterProps?.id),
    errorText: useOptionalContentId(errorTextContent, errorTextProps),
    hint: useOptionalContentId(hintContent, hintProps),
    input: useControlledId(inputProps?.id),
    label: useOptionalContentId(labelContent, labelProps),
    ...props.ids,
  }

  return (
    <TextAreaRoot {...props} ids={ids} maxLength={maxLength}>
      {labelContent ? (
        <TextAreaLabel {...labelProps} id={ids.label}>
          {labelContent}
        </TextAreaLabel>
      ) : null}

      {(counter ?? maxLength !== undefined) ? (
        <TextAreaCounter {...counterProps} />
      ) : null}

      <TextAreaInput
        maxLength={maxLength}
        placeholder={placeholder}
        {...inputProps}
        id={ids.input}
      />

      {hintContent ? (
        <TextAreaHint {...hintProps} id={ids.hint}>
          {hintContent}
        </TextAreaHint>
      ) : null}

      {errorTextContent ? (
        <TextAreaErrorText {...errorTextProps} id={ids.errorText}>
          {errorTextContent}
        </TextAreaErrorText>
      ) : null}
    </TextAreaRoot>
  )
}
