// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreFileUpload,
  type CoreFileUploadHiddenInputProps,
} from "@qualcomm-ui/react-core/file-upload"

export interface FileUploadHiddenInputProps
  extends CoreFileUploadHiddenInputProps {}

export function FileUploadHiddenInput(
  props: FileUploadHiddenInputProps,
): ReactElement {
  return <CoreFileUpload.HiddenInput {...props} />
}
