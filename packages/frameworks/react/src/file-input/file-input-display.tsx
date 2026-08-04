// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useFileUploadContext} from "@qualcomm-ui/react-core/file-upload"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {useQdsFileUploadContext} from "@qualcomm-ui/react/file-upload"
import {useQdsInputContext} from "@qualcomm-ui/react/input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface FileInputDisplayProps extends ElementRenderProp<"span"> {
  /**
   * Text shown when no file has been selected.
   */
  placeholder?: ReactNode
}

export function FileInputDisplay({
  placeholder,
  ...props
}: FileInputDisplayProps): ReactElement {
  const fileUploadContext = useFileUploadContext()
  const qdsFileUploadContext = useQdsFileUploadContext()
  const qdsInputContext = useQdsInputContext()
  const fileName =
    fileUploadContext.acceptedFiles[0]?.name ??
    fileUploadContext.rejectedFiles[0]?.file.name
  const mergedProps = mergeProps(
    qdsFileUploadContext.getInputDisplayBindings(),
    qdsInputContext.getInputBindings(),
    props,
  )

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {fileName ?? placeholder}
    </PolymorphicElement>
  )
}
