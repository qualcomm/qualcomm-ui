// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreFileUpload,
  type CoreFileUploadItemProps,
} from "@qualcomm-ui/react-core/file-upload"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFileUploadContext} from "./qds-file-upload-context"

export interface FileUploadItemProps extends CoreFileUploadItemProps {}

export function FileUploadItem(props: FileUploadItemProps): ReactElement {
  const qdsContext = useQdsFileUploadContext()
  const mergedProps = mergeProps(qdsContext.getItemBindings(), props)
  return <CoreFileUpload.Item {...mergedProps} />
}
