// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useSwitchLabel} from "@qualcomm-ui/react-core/switch"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSwitchContext} from "./qds-switch-context"

export interface SwitchLabelProps extends IdProp, ElementRenderProp<"span"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * An accessible label that is automatically associated with the switch. Renders a
 * `<span>` element by default.
 */
export function SwitchLabel({
  children,
  id,
  ...props
}: SwitchLabelProps): ReactElement {
  const contextProps = useSwitchLabel({id})
  const qdsContext = useQdsSwitchContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getLabelBindings(),
    props,
  )

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
