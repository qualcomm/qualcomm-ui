// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreFileUpload,
  type CoreFileUploadTriggerProps,
} from "@qualcomm-ui/react-core/file-upload"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFileUploadContext} from "./qds-file-upload-context"

export interface FileUploadTriggerProps extends CoreFileUploadTriggerProps {}

export function FileUploadTrigger({
  children,
  ...props
}: FileUploadTriggerProps): ReactElement {
  const qdsContext = useQdsFileUploadContext()

  return (
    <CoreFileUpload.Trigger {...props}>
      {(coreBindings) => {
        const qdsBindings = qdsContext.getTriggerBindings()
        const mergedBindings = mergeProps(qdsBindings, coreBindings)
        return typeof children === "function"
          ? children(mergedBindings)
          : children
      }}
    </CoreFileUpload.Trigger>
  )
}
