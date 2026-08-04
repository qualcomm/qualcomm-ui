// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreFileUpload,
  type CoreFileUploadItemSizeTextProps,
  useFileUploadContext,
  useFileUploadItemContext,
} from "@qualcomm-ui/react-core/file-upload"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFileUploadContext} from "./qds-file-upload-context.js"

export interface FileUploadItemSizeTextProps extends CoreFileUploadItemSizeTextProps {}

export function FileUploadItemSizeText(
  props: FileUploadItemSizeTextProps,
): ReactElement {
  const qdsContext = useQdsFileUploadContext()
  const fileUploadContext = useFileUploadContext()
  const itemContext = useFileUploadItemContext()
  const mergedProps = mergeProps(qdsContext.getItemSizeTextBindings(), props)

  const defaultContent =
    itemContext.type !== "rejected"
      ? fileUploadContext.getFileSize(itemContext.file)
      : null

  return (
    <CoreFileUpload.ItemSizeText {...mergedProps}>
      {props.children ?? defaultContent}
    </CoreFileUpload.ItemSizeText>
  )
}
