// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsBreadcrumbsContext} from "./qds-breadcrumbs-context"

export interface BreadcrumbsItemRootProps extends ElementRenderProp<"li"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * Controls the component's interactivity. If `true`, the component becomes
   * unresponsive to input and is visually dimmed to indicate its disabled state.
   */
  disabled?: boolean
}

export function BreadcrumbsItemRoot({
  children,
  disabled,
  ...props
}: BreadcrumbsItemRootProps): ReactElement {
  const qdsContext = useQdsBreadcrumbsContext()
  const mergedProps = mergeProps(qdsContext.getItemBindings({disabled}), props)

  return (
    <PolymorphicElement as="li" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
