// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreCombobox,
  type CoreComboboxItemGroupLabelProps,
} from "@qualcomm-ui/react-core/combobox"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsComboboxContext} from "./qds-combobox-context.js"

/**
 * @since next-release
 */
export interface ComboboxItemGroupLabelProps extends CoreComboboxItemGroupLabelProps {}

/**
 * Label for an item group. Renders a `<div>` element by default.
 *
 * @since next-release
 */
export function ComboboxItemGroupLabel(
  props: ComboboxItemGroupLabelProps,
): ReactElement {
  const qdsContext = useQdsComboboxContext()
  const mergedProps = mergeProps(qdsContext.getItemGroupLabelBindings(), props)

  return <CoreCombobox.ItemGroupLabel {...mergedProps} />
}
