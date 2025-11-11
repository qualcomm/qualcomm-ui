// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {paginationClasses} from "@qualcomm-ui/qds-core/pagination"
import {usePaginationPageSizeLabel} from "@qualcomm-ui/react-core/pagination"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface PaginationPageSizeLabelProps extends ElementRenderProp<"div"> {
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

export function PaginationPageSizeLabel({
  children,
  id,
  ...props
}: PaginationPageSizeLabelProps): ReactElement {
  const contextProps = usePaginationPageSizeLabel({id})

  const mergedProps = mergeProps(
    contextProps,
    {className: paginationClasses.pageSizeLabel},
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
