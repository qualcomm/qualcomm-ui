// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreFileUpload,
  type CoreFileUploadTriggerProps,
} from "@qualcomm-ui/react-core/file-upload"

export interface FileUploadTriggerProps extends CoreFileUploadTriggerProps {}

export function FileUploadTrigger(
  props: FileUploadTriggerProps,
): ReactElement {
  return <CoreFileUpload.Trigger {...props} />
}
