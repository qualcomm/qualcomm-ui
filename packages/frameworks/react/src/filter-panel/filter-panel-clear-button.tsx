// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useFilterPanelClearTrigger} from "@qualcomm-ui/react-core/filter-panel"
import {Button, type ButtonProps} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFilterPanelContext} from "./qds-filter-panel-context.js"

export interface FilterPanelClearButtonProps extends ButtonProps {}

/**
 * Removes every filter when clicked. In `manual` apply mode, the cleared
 * filters must still be applied. Disabled when no filters are set. Renders a
 * `<button>` element by default.
 */
export function FilterPanelClearButton({
  children = "Clear all",
  ...props
}: FilterPanelClearButtonProps): ReactElement {
  const qdsContext = useQdsFilterPanelContext()

  const mergedProps = mergeProps(
    useFilterPanelClearTrigger(),
    qdsContext.getClearButtonBindings(),
    props,
  )

  return (
    <Button emphasis="primary" variant="ghost" {...mergedProps}>
      {children}
    </Button>
  )
}
