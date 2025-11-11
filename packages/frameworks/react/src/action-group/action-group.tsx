// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {getActionGroupRootBindings} from "@qualcomm-ui/core/action-group"
import {actionGroupClasses} from "@qualcomm-ui/qds-core/action-group"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface ActionGroupProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * Groups a set of actions. Renders a `<div>` element by default.
 */
export function ActionGroup({
  children,
  ...props
}: ActionGroupProps): ReactElement {
  const apiProps = getActionGroupRootBindings()
  const mergedProps = mergeProps(
    {...apiProps, className: actionGroupClasses.root},
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
