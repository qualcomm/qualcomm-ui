// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreFileUpload,
  type CoreFileUploadClearTriggerProps,
} from "@qualcomm-ui/react-core/file-upload"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFileUploadContext} from "./qds-file-upload-context"

export interface FileUploadClearTriggerProps
  extends CoreFileUploadClearTriggerProps {}

export function FileUploadClearTrigger(
  props: FileUploadClearTriggerProps,
): ReactElement {
  const qdsContext = useQdsFileUploadContext()
  const mergedProps = mergeProps(qdsContext.getClearTriggerBindings(), props)
  return <CoreFileUpload.ClearTrigger {...mergedProps} />
}
