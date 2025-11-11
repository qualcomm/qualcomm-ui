// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  InputEndIcon,
  InputStartIcon,
  useQdsInputContext,
} from "@qualcomm-ui/react/input"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {useTextInputInputGroup} from "@qualcomm-ui/react-core/text-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TextInputInputGroupProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * Container that wraps the input element and optional icons. Renders a `<div>`
 * element by default.
 */
export function TextInputInputGroup({
  children,
  ...props
}: TextInputInputGroupProps): ReactElement {
  const qdsContext = useQdsInputContext()
  const contextProps = useTextInputInputGroup()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getGroupBindings(),
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
