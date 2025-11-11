// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreCombobox,
  type CoreComboboxItemProps,
} from "@qualcomm-ui/react-core/combobox"
import type {CollectionItem} from "@qualcomm-ui/utils/collection"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsComboboxContext} from "./qds-combobox-context"

export interface ComboboxItemProps<T extends CollectionItem>
  extends CoreComboboxItemProps<T> {}

/**
 * Individual option within the combobox menu. Renders a `<div>` element by default.
 */
export function ComboboxItem<T extends CollectionItem = CollectionItem>(
  props: ComboboxItemProps<T>,
): ReactElement {
  const qdsContext = useQdsComboboxContext()
  const mergedProps = mergeProps(qdsContext.getItemBindings(), props)

  return <CoreCombobox.Item {...mergedProps} />
}
