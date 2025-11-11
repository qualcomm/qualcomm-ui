// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {useOptionalContentId} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"

import {
  TextInputClearTrigger,
  type TextInputClearTriggerProps,
} from "./text-input-clear-trigger"
import {
  TextInputErrorIndicator,
  type TextInputErrorIndicatorProps,
} from "./text-input-error-indicator"
import {
  TextInputErrorText,
  type TextInputErrorTextProps,
} from "./text-input-error-text"
import {TextInputHint, type TextInputHintProps} from "./text-input-hint"
import {TextInputInput, type TextInputInputProps} from "./text-input-input"
import {
  TextInputInputGroup,
  type TextInputInputGroupProps,
} from "./text-input-input-group"
import {TextInputLabel, type TextInputLabelProps} from "./text-input-label"
import {TextInputRoot, type TextInputRootProps} from "./text-input-root"

export interface TextInputProps extends TextInputRootProps {
  /**
   * The simple TextInput doesn't support children.
   */
  children?: never

  /**
   * When `true`, renders a clear button that resets the input value on click.
   * The button only appears when the input has a value.
   *
   * @default true
   */
  clearable?: boolean

  clearTriggerProps?: TextInputClearTriggerProps

  /**
   * {@link https://lucide.dev lucide-react} icon, positioned after
   * the input. Can be supplied as a `ReactElement` for additional customization.
   */
  endIcon?: LucideIconOrElement

  /**
   * Props applied to the error indicator element.
   */
  errorIndicatorProps?: TextInputErrorIndicatorProps

  /**
   * Optional error that describes the element when {@link invalid} is true.
   */
  errorText?: string

  /**
   * Props applied to the error text element.
   */
  errorTextProps?: TextInputErrorTextProps

  /**
   * Optional hint describing the element. This element is automatically
   * associated with the component's input element for accessibility.
   */
  hint?: ReactNode

  /**
   * Props applied to the label element.
   */
  hintProps?: TextInputHintProps

  /**
   * Props applied to the input group element.
   *
   * @inheritDoc
   */
  inputGroupProps?: TextInputInputGroupProps

  /**
   * Props applied to the input element.
   */
  inputProps?: TextInputInputProps

  /**
   * Optional label describing the element. Recommended. This element is
   * automatically associated with the component's input element for
   * accessibility.
   */
  label?: ReactNode

  /**
   * Props applied to the label element.
   */
  labelProps?: TextInputLabelProps

  /**
   * HTML {@link https://www.w3schools.com/tags/att_input_placeholder.asp placeholder} attribute,
   * passed to the underlying input element.
   */
  placeholder?: string

  /**
   * {@link https://lucide.dev lucide-react} icon, positioned before
   * the input. Can be supplied as a `ReactElement` for additional customization.
   */
  startIcon?: LucideIconOrElement
}

export function TextInput({
  clearable = true,
  clearTriggerProps,
  errorIndicatorProps,
  errorText,
  errorTextProps,
  hint,
  hintProps,
  inputGroupProps,
  inputProps,
  label,
  labelProps,
  placeholder,
  ...props
}: TextInputProps): ReactElement {
  const labelContent = label || labelProps?.children
  const errorTextContent = errorText || errorTextProps?.children
  const hintContent = hint || hintProps?.children

  const ids = {
    errorText: useOptionalContentId(errorTextContent, errorTextProps),
    hint: useOptionalContentId(hintContent, hintProps),
    input: useControlledId(inputProps?.id),
    label: useOptionalContentId(labelContent, labelProps),
    ...props.ids,
  }

  return (
    <TextInputRoot {...props} ids={ids}>
      {labelContent ? (
        <TextInputLabel {...labelProps} id={ids.label}>
          {labelContent}
        </TextInputLabel>
      ) : null}

      <TextInputInputGroup {...inputGroupProps}>
        <TextInputInput
          placeholder={placeholder}
          {...inputProps}
          id={ids.input}
        />
        {clearable ? <TextInputClearTrigger {...clearTriggerProps} /> : null}
        <TextInputErrorIndicator {...errorIndicatorProps} />
      </TextInputInputGroup>

      {hintContent ? (
        <TextInputHint {...hintProps} id={ids.hint}>
          {hintContent}
        </TextInputHint>
      ) : null}

      {errorTextContent ? (
        <TextInputErrorText {...errorTextProps} id={ids.errorText}>
          {errorTextContent}
        </TextInputErrorText>
      ) : null}
    </TextInputRoot>
  )
}
