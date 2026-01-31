// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreFileUpload,
  type CoreFileUploadItemPreviewImageProps,
} from "@qualcomm-ui/react-core/file-upload"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFileUploadContext} from "./qds-file-upload-context"

export interface FileUploadItemPreviewImageProps
  extends CoreFileUploadItemPreviewImageProps {}

export function FileUploadItemPreviewImage(
  props: FileUploadItemPreviewImageProps,
): ReactElement {
  const qdsContext = useQdsFileUploadContext()
  const mergedProps = mergeProps(
    qdsContext.getItemPreviewImageBindings(),
    props,
  )
  return <CoreFileUpload.ItemPreviewImage {...mergedProps} />
}
