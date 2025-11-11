// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useSwitchThumb} from "@qualcomm-ui/react-core/switch"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSwitchContext} from "./qds-switch-context"

export interface SwitchThumbProps extends ElementRenderProp<"span"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * Visual indicator that displays the switch state. Renders a `<span>` element by
 * default.
 */
export function SwitchThumb({
  children,
  ...props
}: SwitchThumbProps): ReactElement {
  const contextProps = useSwitchThumb()
  const qdsContext = useQdsSwitchContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getThumbBindings(),
    props,
  )

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
