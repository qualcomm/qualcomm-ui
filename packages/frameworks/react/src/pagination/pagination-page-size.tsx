// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {Menu} from "@qualcomm-ui/react/menu"
import {usePaginationContext} from "@qualcomm-ui/react-core/pagination"
import {Portal} from "@qualcomm-ui/react-core/portal"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsPaginationContext} from "./qds-pagination-context"

export interface PaginationPageSizeProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * Available page sizes to choose from.
   */
  options: number[]
}

export function PaginationPageSize({
  children,
  options,
  ...props
}: PaginationPageSizeProps): ReactElement {
  const context = usePaginationContext()
  const qdsContext = useQdsPaginationContext()
  const pageSize = context.pageSize
  const setPageSize = context.setPageSize
  const pageSizeLabelId = context.pageSizeLabelId

  const mergedProps = mergeProps(qdsContext.getPageSizeBindings(), props)

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
      <Menu.Root
        onSelect={(value) => {
          setPageSize(parseInt(value))
        }}
        size={qdsContext.size}
      >
        <Menu.Trigger>
          <Menu.Button
            aria-labelledby={pageSizeLabelId}
            emphasis="neutral"
            size={qdsContext.size}
            variant="outline"
          >
            {pageSize}
          </Menu.Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              {options.map((opt) => (
                <Menu.Item key={opt} value={`${opt}`}>
                  {opt}
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </PolymorphicElement>
  )
}
