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

export interface TableFilterPanelRootProps extends ElementRenderProp<"div"> {}

/**
 * The root element of the filter panel. Must be rendered within a
 * `Table.Root`. Renders a `<div>` element by default.
 */
export function TableFilterPanelRoot(
  props: TableFilterPanelRootProps,
): ReactElement {
  const qdsContext = useQdsTableRootContext()

  const mergedProps = mergeProps(qdsContext.getFilterPanelBindings(), props)
  return (
    <ButtonPropsContextProvider value={qdsContext.getFilterPanelButtonProps()}>
      <PolymorphicElement as="div" {...mergedProps} />
    </ButtonPropsContextProvider>
  )
}
