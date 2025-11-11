// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {InputStartIcon, useQdsInputContext} from "@qualcomm-ui/react/input"
import {CorePasswordInput} from "@qualcomm-ui/react-core/password-input"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface PasswordInputInputGroupProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function PasswordInputInputGroup({
  children,
  ...props
}: PasswordInputInputGroupProps): ReactElement {
  const contextProps = CorePasswordInput.usePasswordInputInputGroup()
  const qdsContext = useQdsInputContext()
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
    </PolymorphicElement>
  )
}
