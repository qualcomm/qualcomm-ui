// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreFileUpload,
  type CoreFileUploadItemNameProps,
  useFileUploadItemContext,
} from "@qualcomm-ui/react-core/file-upload"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFileUploadContext} from "./qds-file-upload-context"

export interface FileUploadItemNameProps
  extends CoreFileUploadItemNameProps {}

export function FileUploadItemName(
  props: FileUploadItemNameProps,
): ReactElement {
  const qdsContext = useQdsFileUploadContext()
  const itemContext = useFileUploadItemContext()
  const mergedProps = mergeProps(qdsContext.getItemNameBindings(), props)

  return (
    <CoreFileUpload.ItemName {...mergedProps}>
      {props.children ?? itemContext.file.name}
    </CoreFileUpload.ItemName>
  )
}
