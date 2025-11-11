// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreCombobox,
  type CoreComboboxItemTextProps,
} from "@qualcomm-ui/react-core/combobox"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsComboboxContext} from "./qds-combobox-context"

export interface ComboboxItemTextProps extends CoreComboboxItemTextProps {}

/**
 * Text content of a combobox item. Renders a `<span>` element by default.
 */
export function ComboboxItemText(props: ComboboxItemTextProps): ReactElement {
  const qdsContext = useQdsComboboxContext()
  const mergedProps = mergeProps(qdsContext.getItemTextBindings(), props)

  return <CoreCombobox.ItemText {...mergedProps} />
}
