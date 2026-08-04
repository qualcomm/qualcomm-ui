// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Upload} from "lucide-react"

import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {IconOrNode, type IconOrNodeProps} from "@qualcomm-ui/react/icon"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFileUploadContext} from "./qds-file-upload-context.js"

export interface FileUploadDropzoneIconProps extends Omit<
  IconOrNodeProps,
  "icon" | "size"
> {
  /**
   * Lucide-react icon or JSX element.
   *
   * @default Upload
   */
  icon?: LucideIconOrElement
}

export function FileUploadDropzoneIcon(
  props: FileUploadDropzoneIconProps,
): ReactElement {
  const qdsContext = useQdsFileUploadContext()
  const mergedProps = mergeProps(qdsContext.getDropzoneIconBindings(), props)

  return <IconOrNode icon={Upload} {...mergedProps} />
}
