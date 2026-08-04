// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import {
  createQdsFileUploadApi,
  type QdsFileUploadApiProps,
} from "@qualcomm-ui/qds-core/file-upload"
import {
  CoreFileUpload,
  type CoreFileUploadRootProps,
} from "@qualcomm-ui/react-core/file-upload"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsFileUploadContextProvider} from "./qds-file-upload-context.js"

export interface FileUploadRootProps
  extends CoreFileUploadRootProps, QdsFileUploadApiProps {}

export function FileUploadRoot({
  size,
  ...props
}: FileUploadRootProps): ReactElement {
  const qdsContext = useMemo(
    () => createQdsFileUploadApi({size}, normalizeProps),
    [size],
  )

  const mergedProps = mergeProps(qdsContext.getRootBindings(), props)

  return (
    <QdsFileUploadContextProvider value={qdsContext}>
      <CoreFileUpload.Root {...mergedProps} />
    </QdsFileUploadContextProvider>
  )
}
