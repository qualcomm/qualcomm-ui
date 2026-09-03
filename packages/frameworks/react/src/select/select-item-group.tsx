// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreSelect,
  type CoreSelectItemGroupProps,
} from "@qualcomm-ui/react-core/select"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSelectContext} from "./qds-select-context.js"

/**
 * @since next-release
 */
export interface SelectItemGroupProps extends CoreSelectItemGroupProps {}

/**
 * Visually separates a group of items. Renders a `<div>` element by default.
 *
 * @since next-release
 */
export function SelectItemGroup(props: SelectItemGroupProps): ReactElement {
  const qdsContext = useQdsSelectContext()
  const mergedProps = mergeProps(qdsContext.getItemGroupBindings(), props)

  return <CoreSelect.ItemGroup {...mergedProps} />
}
