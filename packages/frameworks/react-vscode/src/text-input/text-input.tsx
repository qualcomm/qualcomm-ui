import type {ReactElement, ReactNode} from "react"

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
  clearable?: boolean
  clearTriggerProps?: TextInputClearTriggerProps
  errorIndicatorProps?: TextInputErrorIndicatorProps
  errorText?: ReactNode
  errorTextProps?: TextInputErrorTextProps
  hint?: ReactNode
  hintProps?: TextInputHintProps
  inputGroupProps?: TextInputInputGroupProps
  inputProps?: TextInputInputProps
  label?: ReactNode
  labelProps?: TextInputLabelProps
}

export function TextInput({
  clearable,
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
        <TextInputInput {...inputProps} id={ids.input} />
        {clearable ? <TextInputClearTrigger {...clearTriggerProps} /> : null}
        {errorTextContent ? (
          <TextInputErrorIndicator {...errorIndicatorProps} />
        ) : null}
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
