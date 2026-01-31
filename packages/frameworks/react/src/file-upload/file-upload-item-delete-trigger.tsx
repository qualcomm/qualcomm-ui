// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreFileUpload,
  type CoreFileUploadItemDeleteTriggerProps,
} from "@qualcomm-ui/react-core/file-upload"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFileUploadContext} from "./qds-file-upload-context"

export interface FileUploadItemDeleteTriggerProps
  extends CoreFileUploadItemDeleteTriggerProps {}

export function FileUploadItemDeleteTrigger(
  props: FileUploadItemDeleteTriggerProps,
): ReactElement {
  const qdsContext = useQdsFileUploadContext()
  const mergedProps = mergeProps(
    qdsContext.getItemDeleteTriggerBindings(),
    props,
  )
  return <CoreFileUpload.ItemDeleteTrigger {...mergedProps} />
}
