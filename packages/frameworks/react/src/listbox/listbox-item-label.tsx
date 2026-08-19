// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreListbox,
  type CoreListboxItemLabelProps,
} from "@qualcomm-ui/react-core/listbox"
import {ListItem} from "@qualcomm-ui/react/list-item"

export interface ListboxItemLabelProps extends CoreListboxItemLabelProps {}

/**
 * The primary text of a listbox option. Renders a `<span>` element by default.
 */
export function ListboxItemLabel(props: ListboxItemLabelProps): ReactElement {
  return <CoreListbox.ItemLabel render={<ListItem.Label />} {...props} />
}
