// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useSwitchControl} from "@qualcomm-ui/react-core/switch"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSwitchContext} from "./qds-switch-context"
import {SwitchThumb} from "./switch-thumb"

export interface SwitchControlProps extends ElementRenderProp<"span"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   *
   * @default `<SwitchThumb />`
   */
  children?: ReactNode
}

/**
 * Visual control that wraps the switch thumb. Renders a `<span>` element by
 * default.
 */
export function SwitchControl({
  children = <SwitchThumb />,
  ...props
}: SwitchControlProps): ReactElement {
  const contextProps = useSwitchControl()
  const qdsContext = useQdsSwitchContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getControlBindings(),
    props,
  )

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
