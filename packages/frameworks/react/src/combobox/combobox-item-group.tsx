// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreCombobox,
  type CoreComboboxItemGroupProps,
} from "@qualcomm-ui/react-core/combobox"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsComboboxContext} from "./qds-combobox-context.js"

/**
 * @since next-release
 */
export interface ComboboxItemGroupProps extends CoreComboboxItemGroupProps {}

/**
 * Visually separates a group of items. Renders a `<div>` element by default.
 *
 * @since next-release
 */
export function ComboboxItemGroup(props: ComboboxItemGroupProps): ReactElement {
  const qdsContext = useQdsComboboxContext()
  const mergedProps = mergeProps(qdsContext.getItemGroupBindings(), props)

  return <CoreCombobox.ItemGroup {...mergedProps} />
}
