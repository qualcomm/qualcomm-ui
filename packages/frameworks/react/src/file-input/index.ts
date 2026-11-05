import type {FunctionComponent} from "react"

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
import {
  type FileInputProps,
  FileInput as SimpleFileInput,
} from "./file-input.js"

export type {
  FileInputClearTriggerProps,
  FileInputLabelProps,
  FileInputControlProps,
  FileInputHiddenInputProps,
  FileInputRootProps,
  FileInputErrorTextProps,
  FileInputDisplayProps,
  FileInputProps,
}

type FileInputComponent = typeof SimpleFileInput & {
  ClearTrigger: FunctionComponent<FileInputClearTriggerProps>
  Control: FunctionComponent<FileInputControlProps>
  Display: FunctionComponent<FileInputDisplayProps>
  ErrorText: FunctionComponent<FileInputErrorTextProps>
  HiddenInput: FunctionComponent<FileInputHiddenInputProps>
  Label: FunctionComponent<FileInputLabelProps>
  Root: FunctionComponent<FileInputRootProps>
}

/**
 * @since 1.22.0
 */
export const FileInput: FileInputComponent =
  SimpleFileInput as FileInputComponent

FileInput.ClearTrigger = FileInputClearTrigger
FileInput.Label = FileInputLabel
FileInput.Control = FileInputControl
FileInput.HiddenInput = FileInputHiddenInput
FileInput.Root = FileInputRoot
FileInput.ErrorText = FileInputErrorText
FileInput.Display = FileInputDisplay
