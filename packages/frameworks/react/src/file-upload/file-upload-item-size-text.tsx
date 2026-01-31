// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreFileUpload,
  type CoreFileUploadItemSizeTextProps,
} from "@qualcomm-ui/react-core/file-upload"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFileUploadContext} from "./qds-file-upload-context"

export interface FileUploadItemSizeTextProps
  extends CoreFileUploadItemSizeTextProps {}

export function FileUploadItemSizeText(
  props: FileUploadItemSizeTextProps,
): ReactElement {
  const qdsContext = useQdsFileUploadContext()
  const mergedProps = mergeProps(qdsContext.getItemSizeTextBindings(), props)
  return <CoreFileUpload.ItemSizeText {...mergedProps} />
}
