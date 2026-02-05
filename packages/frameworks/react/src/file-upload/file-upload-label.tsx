// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {Asterisk} from "lucide-react"

import {
  CoreFileUpload,
  type CoreFileUploadLabelProps,
  useFileUploadContext,
} from "@qualcomm-ui/react-core/file-upload"
import {Icon} from "@qualcomm-ui/react/icon"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFileUploadContext} from "./qds-file-upload-context"

export interface FileUploadLabelProps extends CoreFileUploadLabelProps {
  children?: ReactNode
}

export function FileUploadLabel({
  children,
  ...props
}: FileUploadLabelProps): ReactElement {
  const context = useFileUploadContext()
  const qdsContext = useQdsFileUploadContext()
  const mergedProps = mergeProps(qdsContext.getLabelBindings(), props)

  return (
    <CoreFileUpload.Label {...mergedProps}>
      {children}
      {context.required ? (
        <Icon
          {...qdsContext.getRequiredIndicatorBindings()}
          icon={Asterisk}
          size="xs"
        />
      ) : null}
    </CoreFileUpload.Label>
  )
}
