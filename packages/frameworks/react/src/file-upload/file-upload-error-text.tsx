// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  CoreFileUpload,
  type CoreFileUploadErrorTextProps,
} from "@qualcomm-ui/react-core/file-upload"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {IconOrNode} from "@qualcomm-ui/react/icon"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFileUploadContext} from "./qds-file-upload-context.js"

export interface FileUploadErrorTextProps extends CoreFileUploadErrorTextProps {
  children?: ReactNode

  /**
   * Optional error indicator icon.
   */
  icon?: LucideIconOrElement
}

export function FileUploadErrorText({
  children,
  icon,
  ...props
}: FileUploadErrorTextProps): ReactElement {
  const qdsContext = useQdsFileUploadContext()
  const mergedProps = mergeProps(qdsContext.getErrorTextBindings(), props)

  return (
    <CoreFileUpload.ErrorText {...mergedProps}>
      {icon ? <IconOrNode icon={icon} /> : null}
      {children}
    </CoreFileUpload.ErrorText>
  )
}
