// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useOptionalContentId} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"

import {PasswordInputClearTrigger} from "./password-input-clear-trigger"
import {
  PasswordInputErrorIndicator,
  type PasswordInputErrorIndicatorProps,
} from "./password-input-error-indicator"
import {
  PasswordInputErrorText,
  type PasswordInputErrorTextProps,
} from "./password-input-error-text"
import {
  PasswordInputHint,
  type PasswordInputHintProps,
} from "./password-input-hint"
import {
  PasswordInputInput,
  type PasswordInputInputProps,
} from "./password-input-input"
import {
  PasswordInputInputGroup,
  type PasswordInputInputGroupProps,
} from "./password-input-input-group"
import {
  PasswordInputLabel,
  type PasswordInputLabelProps,
} from "./password-input-label"
import {
  PasswordInputRoot,
  type PasswordInputRootProps,
} from "./password-input-root"
import {
  PasswordInputVisibilityTrigger,
  type PasswordInputVisibilityTriggerProps,
} from "./password-input-visibility-trigger"

export interface PasswordInputProps extends PasswordInputRootProps {
  /**
   * The simple PasswordInput doesn't support children.
   */
  children?: never

  /**
   * When `true`, renders a clear button that resets the input value on click.
   * The button only appears when the input has a value.
   *
   * @default false
   */
  clearable?: boolean

  /**
   * Props applied to the error indicator element.
   *
   * @inheritDoc
   */
  errorIndicatorProps?: PasswordInputErrorIndicatorProps

  /**
   * Optional error that describes the element when {@link invalid} is true.
   */
  errorText?: string

  /**
   * Props applied to the error text element.
   *
   * @inheritDoc
   */
  errorTextProps?: PasswordInputErrorTextProps

  /**
   * Optional hint describing the element. This element is automatically
   * associated with the component's input element for accessibility.
   */
  hint?: ReactNode

  /**
   * Props applied to the label element.
   *
   * @inheritDoc
   */
  hintProps?: PasswordInputHintProps

  /**
   * Props applied to the input group element.
   *
   * @inheritDoc
   */
  inputGroupProps?: PasswordInputInputGroupProps

  /**
   * Props applied to the input element.
   *
   * @inheritDoc
   */
  inputProps?: PasswordInputInputProps

  /**
   * Optional label describing the element. Recommended. This element is
   * automatically associated with the component's input element for
   * accessibility.
   */
  label?: ReactNode

  /**
   * Props applied to the label element.
   *
   * @inheritDoc
   */
  labelProps?: PasswordInputLabelProps

  /**
   * HTML {@link https://www.w3schools.com/tags/att_input_placeholder.asp placeholder} attribute,
   * passed to the underlying input element.
   */
  placeholder?: string

  /**
   * Props applied to the visibility trigger element.
   *
   * @inheritDoc
   */
  visibilityTriggerProps?: PasswordInputVisibilityTriggerProps
}

export function PasswordInput({
  clearable,
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
  visibilityTriggerProps,
  ...props
}: PasswordInputProps): ReactElement {
  const labelContent = label || labelProps?.children
  const errorTextContent = errorText || errorTextProps?.children
  const hintContent = hint || hintProps?.children

  const visibilityTriggerId = useControlledId(visibilityTriggerProps?.id)

  const ids = {
    errorText: useOptionalContentId(errorTextContent, errorTextProps),
    hint: useOptionalContentId(hintContent, hintProps),
    input: useControlledId(inputProps?.id),
    label: useOptionalContentId(labelContent, labelProps),
    visibilityTrigger: visibilityTriggerId,
    ...props.ids,
  }

  return (
    <PasswordInputRoot {...props} ids={ids}>
      {labelContent ? (
        <PasswordInputLabel {...labelProps} id={ids.label}>
          {labelContent}
        </PasswordInputLabel>
      ) : null}

      <PasswordInputInputGroup {...inputGroupProps}>
        <PasswordInputInput
          placeholder={placeholder}
          {...inputProps}
          id={ids.input}
        />
        {clearable ? <PasswordInputClearTrigger /> : null}
        <PasswordInputVisibilityTrigger
          {...visibilityTriggerProps}
          id={ids.visibilityTrigger}
        />
        <PasswordInputErrorIndicator {...errorIndicatorProps} />
      </PasswordInputInputGroup>

      {hintContent ? (
        <PasswordInputHint {...hintProps} id={ids.hint}>
          {hintContent}
        </PasswordInputHint>
      ) : null}

      {errorTextContent ? (
        <PasswordInputErrorText {...errorTextProps} id={ids.errorText}>
          {errorTextContent}
        </PasswordInputErrorText>
      ) : null}
    </PasswordInputRoot>
  )
}
