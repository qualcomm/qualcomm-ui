// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {ButtonPropsContextProvider} from "@qualcomm-ui/react/button"
import {useQdsTableRootContext} from "@qualcomm-ui/react/table"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TableToolbarRootProps extends ElementRenderProp<"div"> {}

/**
 * The root element of the toolbar. Must be rendered within a `Table.Root`.
 * Buttons rendered inside the toolbar inherit a size derived from the table
 * size. Renders a `<div>` element by default.
 */
export function TableToolbarRoot(props: TableToolbarRootProps): ReactElement {
  const qdsContext = useQdsTableRootContext()

  const mergedProps = mergeProps(qdsContext.getToolbarBindings(), props)
  return (
    <ButtonPropsContextProvider value={qdsContext.getToolbarButtonProps()}>
      <PolymorphicElement as="div" {...mergedProps} />
    </ButtonPropsContextProvider>
  )
}
