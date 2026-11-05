// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import {createQdsFileUploadApi} from "@qualcomm-ui/qds-core/file-upload"
import {createQdsInputApi} from "@qualcomm-ui/qds-core/input"
import {
  CoreFileUpload,
  type CoreFileUploadRootProps,
} from "@qualcomm-ui/react-core/file-upload"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {QdsFileUploadContextProvider} from "@qualcomm-ui/react/file-upload"
import {
  QdsInputContextProvider,
  type QdsReactInputApiProps,
} from "@qualcomm-ui/react/input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface FileInputRootProps
  extends CoreFileUploadRootProps, QdsReactInputApiProps {}

export function FileInputRoot({
  endIcon,
  invalid,
  size,
  startIcon,
  ...props
}: FileInputRootProps): ReactElement {
  const qdsContext = useMemo(
    () => createQdsInputApi({endIcon, size, startIcon}, normalizeProps),
    [endIcon, size, startIcon],
  )
  const qdsFileUploadContext = useMemo(
    () => createQdsFileUploadApi({size}, normalizeProps),
    [size],
  )
  const mergedProps = mergeProps(qdsContext.getRootBindings(), props)

  return (
    <QdsInputContextProvider value={qdsContext}>
      <QdsFileUploadContextProvider value={qdsFileUploadContext}>
        <CoreFileUpload.Root {...mergedProps} invalid={invalid} />
      </QdsFileUploadContextProvider>
    </QdsInputContextProvider>
  )
}
