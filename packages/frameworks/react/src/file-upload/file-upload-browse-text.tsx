// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {createQdsLinkApi} from "@qualcomm-ui/qds-core/link"
import {useFileUploadContext} from "@qualcomm-ui/react-core/file-upload"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFileUploadContext} from "./qds-file-upload-context.js"

export interface FileUploadBrowseTextProps extends ElementRenderProp<"span"> {}

export function FileUploadBrowseText(
  props: FileUploadBrowseTextProps,
): ReactElement {
  const fileUploadContext = useFileUploadContext()
  const qdsContext = useQdsFileUploadContext()
  const api = createQdsLinkApi(
    {
      disabled: fileUploadContext.disabled,
      emphasis: "brand",
      inheritFontSize: true,
      size: qdsContext.size,
    },
    normalizeProps,
  )

  const mergedProps = mergeProps(api.getRootBindings(), props)

  return <span {...mergedProps} />
}
