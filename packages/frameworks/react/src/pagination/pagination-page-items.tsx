// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Fragment, type ReactElement, type ReactNode} from "react"

import type {PaginationPageItemBindings} from "@qualcomm-ui/core/pagination"
import {type BindingRenderProp, renderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {PaginationContext} from "./pagination-context"
import {PaginationPageItem} from "./pagination-page-item"
import {useQdsPaginationContext} from "./qds-pagination-context"

export interface PaginationPageItemsProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * Page item {@link
   * https://react-next.qui.qualcomm.com/render-props#binding-render-prop
   * Render Prop}
   *
   * @inheritDoc
   */
  renderItem?: BindingRenderProp<PaginationPageItemBindings>
}

export function PaginationPageItems({
  children,
  renderItem: renderItemProp,
}: PaginationPageItemsProps): ReactElement {
  const PageItem = renderItemProp || PaginationPageItem

  const qdsContext = useQdsPaginationContext()

  return (
    <PaginationContext>
      {(context) => (
        <>
          {context.pageItems.map((item, index) => {
            const itemProps = context.getPageItemBindings(item)
            return (
              <Fragment key={index}>
                {renderProp(
                  PageItem,
                  mergeProps(itemProps, qdsContext.getPageItemBindings()),
                )}
              </Fragment>
            )
          })}
          {children}
        </>
      )}
    </PaginationContext>
  )
}
