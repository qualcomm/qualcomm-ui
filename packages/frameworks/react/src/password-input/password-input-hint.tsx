// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useQdsInputContext} from "@qualcomm-ui/react/input"
import {CorePasswordInput} from "@qualcomm-ui/react-core/password-input"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface PasswordInputHintProps extends ElementRenderProp<"span"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function PasswordInputHint({
  children,
  id,
  ...props
}: PasswordInputHintProps): ReactElement {
  const contextProps = CorePasswordInput.usePasswordInputHint({id})
  const qdsContext = useQdsInputContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getHintBindings(),
    props,
  )

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
