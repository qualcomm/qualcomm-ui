// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {PolymorphicElement} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFileUploadContext} from "./qds-file-upload-context"

export interface FileUploadDropzoneHintProps
  extends ElementRenderProp<"span"> {}

export function FileUploadDropzoneHint(
  props: FileUploadDropzoneHintProps,
): ReactElement {
  const qdsContext = useQdsFileUploadContext()
  const mergedProps = mergeProps(qdsContext.getDropzoneHintBindings(), props)
  return <PolymorphicElement as="span" {...mergedProps} />
}
