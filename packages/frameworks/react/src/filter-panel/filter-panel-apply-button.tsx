// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useFilterPanelApplyTrigger} from "@qualcomm-ui/react-core/filter-panel"
import {Button, type ButtonProps} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFilterPanelContext} from "./qds-filter-panel-context.js"

export interface FilterPanelApplyButtonProps extends ButtonProps {}

/**
 * Commits the draft filters when clicked. Disabled when the draft matches the
 * committed filters, which is always the case in `auto` apply mode. Renders a
 * `<button>` element by default.
 */
export function FilterPanelApplyButton({
  children = "Apply",
  ...props
}: FilterPanelApplyButtonProps): ReactElement {
  const qdsContext = useQdsFilterPanelContext()

  const mergedProps = mergeProps(
    useFilterPanelApplyTrigger(),
    qdsContext.getApplyButtonBindings(),
    props,
  )

  return (
    <Button
      emphasis="primary"
      variant="fill"
      {...qdsContext.getApplyButtonProps()}
      {...mergedProps}
    >
      {children}
    </Button>
  )
}
