// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreSelect,
  type CoreSelectItemGroupLabelProps,
} from "@qualcomm-ui/react-core/select"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSelectContext} from "./qds-select-context.js"

/**
 * @since 1.31.0
 */
export interface SelectItemGroupLabelProps extends CoreSelectItemGroupLabelProps {}

/**
 * Label for an item group. Renders a `<div>` element by default.
 *
 * @since 1.31.0
 */
export function SelectItemGroupLabel(
  props: SelectItemGroupLabelProps,
): ReactElement {
  const qdsContext = useQdsSelectContext()
  const mergedProps = mergeProps(qdsContext.getItemGroupLabelBindings(), props)

  return <CoreSelect.ItemGroupLabel {...mergedProps} />
}
