// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useFileUploadContext} from "@qualcomm-ui/react-core/file-upload"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {
  InputEndIcon,
  InputStartIcon,
  useQdsInputContext,
} from "@qualcomm-ui/react/input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface FileInputControlProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function FileInputControl({
  children,
  ...props
}: FileInputControlProps): ReactElement {
  const fileUploadContext = useFileUploadContext()
  const qdsContext = useQdsInputContext()
  const mergedProps = mergeProps(
    qdsContext.getGroupBindings(),
    fileUploadContext.getDropzoneBindings(),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {qdsContext.startIcon ? (
        <InputStartIcon icon={qdsContext.startIcon} />
      ) : null}
      {children}
      {qdsContext.endIcon ? <InputEndIcon icon={qdsContext.endIcon} /> : null}
    </PolymorphicElement>
  )
}
