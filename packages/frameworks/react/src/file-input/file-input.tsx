// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useControlledId} from "@qualcomm-ui/react-core/state"

import {
  FileInputClearTrigger,
  type FileInputClearTriggerProps,
} from "./file-input-clear-trigger.js"
import {
  FileInputControl,
  type FileInputControlProps,
} from "./file-input-control.js"
import {
  FileInputDisplay,
  type FileInputDisplayProps,
} from "./file-input-display.js"
import {
  FileInputErrorText,
  type FileInputErrorTextProps,
} from "./file-input-error-text.js"
import {
  FileInputHiddenInput,
  type FileInputHiddenInputProps,
} from "./file-input-hidden-input.js"
import {FileInputLabel, type FileInputLabelProps} from "./file-input-label.js"
import {FileInputRoot, type FileInputRootProps} from "./file-input-root.js"

export interface FileInputProps extends FileInputRootProps {
  /**
   * The simple FileInput doesn't support children.
   */
  children?: never

  /**
   * When `true`, renders a clear button that resets the selected file on click.
   * The button only appears when a file has been selected.
   *
   * @default true
   */
  clearable?: boolean

  clearTriggerProps?: FileInputClearTriggerProps

  /**
   * Props applied to the visible input-like control.
   */
  controlProps?: FileInputControlProps

  /**
   * Props applied to the selected file name display.
   */
  displayProps?: FileInputDisplayProps

  /**
   * Optional error message that describes the element when {@link invalid} is true.
   */
  errorText?: ReactNode

  /**
   * Props applied to the error text element.
   */
  errorTextProps?: FileInputErrorTextProps

  /**
   * Props applied to the hidden file input element.
   */
  hiddenInputProps?: FileInputHiddenInputProps

  /**
   * Optional label describing the file input. This element is automatically
   * associated with the hidden file input for accessibility.
   */
  label?: ReactNode

  /**
   * Props applied to the label element.
   */
  labelProps?: FileInputLabelProps

  /**
   * Text shown when no file has been selected.
   */
  placeholder?: ReactNode
}

/**
 * @since 1.22.0
 */
export function FileInput({
  clearable = true,
  clearTriggerProps,
  controlProps,
  displayProps,
  errorText,
  errorTextProps,
  hiddenInputProps,
  label,
  labelProps,
  placeholder,
  ...props
}: FileInputProps): ReactElement {
  const labelContent = label || labelProps?.children
  const errorTextContent = errorText || errorTextProps?.children

  const ids = {
    clearTrigger: useControlledId(clearTriggerProps?.id),
    errorText: useControlledId(errorTextProps?.id),
    hiddenInput: useControlledId(hiddenInputProps?.id),
    label: useControlledId(labelProps?.id),
    root: useControlledId(props.id),
    ...props.ids,
  }

  return (
    <FileInputRoot {...props} id={ids.root} ids={ids}>
      {labelContent ? (
        <FileInputLabel {...labelProps} id={ids.label}>
          {labelContent}
        </FileInputLabel>
      ) : null}

      <FileInputControl {...controlProps}>
        <FileInputDisplay placeholder={placeholder} {...displayProps} />
        {clearable ? (
          <FileInputClearTrigger {...clearTriggerProps} id={ids.clearTrigger} />
        ) : null}
      </FileInputControl>

      <FileInputHiddenInput {...hiddenInputProps} id={ids.hiddenInput} />

      {errorTextContent ? (
        <FileInputErrorText {...errorTextProps} id={ids.errorText}>
          {errorTextContent}
        </FileInputErrorText>
      ) : null}
    </FileInputRoot>
  )
}
