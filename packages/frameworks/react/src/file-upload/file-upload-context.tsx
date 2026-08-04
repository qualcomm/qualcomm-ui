// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreFileUpload,
  type CoreFileUploadContextProps,
} from "@qualcomm-ui/react-core/file-upload"

export interface FileUploadContextProps extends CoreFileUploadContextProps {}

export function FileUploadContext(props: FileUploadContextProps): ReactElement {
  return <CoreFileUpload.Context {...props} />
}
