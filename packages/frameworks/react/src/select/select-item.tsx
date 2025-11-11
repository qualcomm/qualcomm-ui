// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {CoreSelect, type CoreSelectItemProps} from "@qualcomm-ui/react-core/select"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSelectContext} from "./qds-select-context"

export interface SelectItemProps extends CoreSelectItemProps {}

/**
 * Individual option within the select menu. Renders a `<div>` element by default.
 */
export function SelectItem({
  children,
  item,
  ...props
}: SelectItemProps): ReactElement {
  const qdsContext = useQdsSelectContext()
  const mergedProps = mergeProps(qdsContext.getItemBindings(), props)

  return (
    <CoreSelect.Item item={item} {...mergedProps}>
      {children}
    </CoreSelect.Item>
  )
}
