// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useId} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsBreadcrumbsContext} from "./qds-breadcrumbs-context"

export interface BreadcrumbsItemTooltipProps extends ElementRenderProp<"span"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be automatically generated for
   * accessibility.
   */
  id?: string
}

export function BreadcrumbsItemTooltip({
  children,
  id,
  ...props
}: BreadcrumbsItemTooltipProps): ReactElement {
  const autoId = useId()
  const qdsContext = useQdsBreadcrumbsContext()
  const mergedProps = mergeProps(
    qdsContext.getItemTooltipBindings({id: id || autoId}),
    props,
  )

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
