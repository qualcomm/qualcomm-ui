// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useOptionalContentId} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"

import {
  NumberInputControl,
  type NumberInputControlProps,
} from "./number-input-control"
import {
  NumberInputDecrementTrigger,
  type NumberInputDecrementTriggerProps,
} from "./number-input-decrement-trigger"
import {NumberInputErrorIndicator} from "./number-input-error-indicator"
import {
  NumberInputErrorText,
  type NumberInputErrorTextProps,
} from "./number-input-error-text"
import {NumberInputHint, type NumberInputHintProps} from "./number-input-hint"
import {
  NumberInputIncrementTrigger,
  type NumberInputIncrementTriggerProps,
} from "./number-input-increment-trigger"
import {
  NumberInputInput,
  type NumberInputInputProps,
} from "./number-input-input"
import {
  NumberInputInputGroup,
  type NumberInputInputGroupProps,
} from "./number-input-input-group"
import {
  NumberInputLabel,
  type NumberInputLabelProps,
} from "./number-input-label"
import {NumberInputRoot, type NumberInputRootProps} from "./number-input-root"

export interface NumberInputProps extends NumberInputRootProps {
  /**
   * The simple NumberInput doesn't support children.
   */
  children?: never

  /**
   * Props applied to the control element.
   */
  controlProps?: NumberInputControlProps

  /**
   * Props applied to the decrement trigger button.
   */
  decrementTriggerProps?: NumberInputDecrementTriggerProps

  /**
   * Optional error that describes the element when {@link invalid} is true.
   */
  errorText?: string

  /**
   * Props applied to the error text element.
   */
  errorTextProps?: NumberInputErrorTextProps

  /**
   * Optional hint describing the element. This element is automatically
   * associated with the component's input element for accessibility.
   */
  hint?: ReactNode

  /**
   * Props applied to the label element.
   */
  hintProps?: NumberInputHintProps

  /**
   * Props applied to the increment trigger button.
   */
  incrementTriggerProps?: NumberInputIncrementTriggerProps

  /**
   * Props applied to the input group element.
   */
  inputGroupProps?: NumberInputInputGroupProps

  /**
   * Props applied to the input element.
   */
  inputProps?: NumberInputInputProps

  /**
   * Optional label describing the element. Recommended. This element is
   * automatically associated with the component's input element for
   * accessibility.
   */
  label?: ReactNode

  /**
   * Props applied to the label element.
   */
  labelProps?: NumberInputLabelProps

  /**
   * HTML {@link https://www.w3schools.com/tags/att_input_placeholder.asp placeholder} attribute,
   * passed to the underlying input element.
   */
  placeholder?: string
}

export function NumberInput({
  controlProps,
  decrementTriggerProps,
  errorText,
  errorTextProps,
  hint,
  hintProps,
  incrementTriggerProps,
  inputGroupProps,
  inputProps,
  label,
  labelProps,
  placeholder,
  ...props
}: NumberInputProps): ReactElement {
  const labelContent = label || labelProps?.children
  const errorTextContent = errorText || errorTextProps?.children
  const hintContent = hint || hintProps?.children

  const ids = {
    decrementTrigger: useControlledId(decrementTriggerProps?.id),
    errorText: useOptionalContentId(errorTextContent, errorTextProps),
    hint: useOptionalContentId(hintContent, hintProps),
    incrementTrigger: useControlledId(incrementTriggerProps?.id),
    input: useControlledId(inputProps?.id),
    label: useOptionalContentId(labelContent, labelProps),
    ...props.ids,
  }

  return (
    <NumberInputRoot {...props} ids={ids}>
      {labelContent ? (
        <NumberInputLabel {...labelProps} id={ids.label}>
          {labelContent}
        </NumberInputLabel>
      ) : null}

      <NumberInputInputGroup {...inputGroupProps}>
        <NumberInputInput
          placeholder={placeholder}
          {...inputProps}
          id={ids.input}
        />
        <NumberInputControl {...controlProps}>
          <NumberInputDecrementTrigger
            {...decrementTriggerProps}
            id={ids.decrementTrigger}
          />
          <NumberInputIncrementTrigger
            {...incrementTriggerProps}
            id={ids.incrementTrigger}
          />
        </NumberInputControl>
        <NumberInputErrorIndicator />
      </NumberInputInputGroup>

      {hintContent ? (
        <NumberInputHint {...hintProps} id={ids.hint}>
          {hintContent}
        </NumberInputHint>
      ) : null}

      {errorTextContent ? (
        <NumberInputErrorText {...errorTextProps} id={ids.errorText}>
          {errorTextContent}
        </NumberInputErrorText>
      ) : null}
    </NumberInputRoot>
  )
}
