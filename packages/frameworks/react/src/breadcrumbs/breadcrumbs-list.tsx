// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsBreadcrumbsContext} from "./qds-breadcrumbs-context"

export interface BreadcrumbsListProps extends ElementRenderProp<"ol"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * The list of breadcrumbs. Renders an `<ol>` element by default.
 */
export function BreadcrumbsList({
  children,
  ...props
}: BreadcrumbsListProps): ReactElement {
  const qdsContext = useQdsBreadcrumbsContext()
  const mergedProps = mergeProps(qdsContext.getListBindings(), props)

  return (
    <PolymorphicElement as="ol" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
