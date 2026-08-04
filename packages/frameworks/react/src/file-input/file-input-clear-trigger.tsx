// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {X} from "lucide-react"

import {
  type CoreFileUploadClearTriggerProps,
  useFileUploadContext,
} from "@qualcomm-ui/react-core/file-upload"
import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"
import {useQdsInputContext} from "@qualcomm-ui/react/input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface FileInputClearTriggerProps extends CoreFileUploadClearTriggerProps {}

export function FileInputClearTrigger(
  props: FileInputClearTriggerProps,
): ReactElement {
  const fileUploadContext = useFileUploadContext()
  const qdsContext = useQdsInputContext()
  const mergedProps = mergeProps(
    fileUploadContext.getClearTriggerBindings(),
    qdsContext.getClearTriggerBindings(),
    props,
  )

  return (
    <InlineIconButton
      icon={X}
      size={qdsContext.size}
      variant="scale"
      {...mergedProps}
    />
  )
}
