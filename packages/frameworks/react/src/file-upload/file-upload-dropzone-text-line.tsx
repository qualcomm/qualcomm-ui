// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFileUploadContext} from "./qds-file-upload-context"

export interface FileUploadDropzoneTextLineProps
  extends ElementRenderProp<"div"> {}

export function FileUploadDropzoneTextLine(
  props: FileUploadDropzoneTextLineProps,
): ReactElement {
  const qdsContext = useQdsFileUploadContext()
  const mergedProps = mergeProps(
    qdsContext.getDropzoneTextLineBindings(),
    props,
  )
  return <PolymorphicElement as="div" {...mergedProps} />
}
