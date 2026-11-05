// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreFileUpload,
  type CoreFileUploadItemGroupProps,
} from "@qualcomm-ui/react-core/file-upload"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFileUploadContext} from "./qds-file-upload-context.js"

export interface FileUploadItemGroupProps extends CoreFileUploadItemGroupProps {}

export function FileUploadItemGroup(
  props: FileUploadItemGroupProps,
): ReactElement {
  const qdsContext = useQdsFileUploadContext()
  const mergedProps = mergeProps(qdsContext.getItemGroupBindings(), props)
  return <CoreFileUpload.ItemGroup {...mergedProps} />
}
