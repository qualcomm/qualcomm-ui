// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import type {PageMetadata} from "@qualcomm-ui/core/pagination"
import {usePaginationPageMetadata} from "@qualcomm-ui/react-core/pagination"
import {
  type ElementRenderProp,
  PolymorphicElement,
  type RenderProp,
  renderProp,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsPaginationContext} from "./qds-pagination-context"

export interface PaginationPageMetadataProps
  extends Omit<ElementRenderProp<"div">, "children"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: RenderProp<PageMetadata>
}

export function PaginationPageMetadata({
  children,
  ...props
}: PaginationPageMetadataProps): ReactElement {
  const {pageMetadata, props: contextProps} = usePaginationPageMetadata()
  const qdsContext = useQdsPaginationContext()

  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getPageMetadataBindings(),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {renderProp(children || DefaultMetadata, pageMetadata)}
    </PolymorphicElement>
  )
}

const DefaultMetadata: RenderProp<PageMetadata> = ({
  page,
  pageCount,
}): ReactNode => {
  return `${page} of ${pageCount}`
}
