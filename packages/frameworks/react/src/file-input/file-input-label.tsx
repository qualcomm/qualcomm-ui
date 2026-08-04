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
import {useQdsInputContext} from "@qualcomm-ui/react/input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface FileInputLabelProps extends CoreFileUploadLabelProps {
  children?: ReactNode
}

export function FileInputLabel({
  children,
  ...props
}: FileInputLabelProps): ReactElement {
  const fileUploadContext = useFileUploadContext()
  const qdsContext = useQdsInputContext()
  const mergedProps = mergeProps(qdsContext.getLabelBindings(), props)

  return (
    <CoreFileUpload.Label {...mergedProps}>
      {children}
      {fileUploadContext.required ? (
        <Icon
          {...qdsContext.getRequiredIndicatorBindings()}
          icon={Asterisk}
          size="xs"
        />
      ) : null}
    </CoreFileUpload.Label>
  )
}
