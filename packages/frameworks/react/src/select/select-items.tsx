// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useSelectContext} from "@qualcomm-ui/react-core/select"

import {SelectItem} from "./select-item"
import {SelectItemIndicator} from "./select-item-indicator"
import {SelectItemText} from "./select-item-text"

/**
 * Shortcut for rendering a list of select items. Uses the {@link collection} to
 * determine the label and value for each item.
 */
export function SelectItems(): ReactElement {
  const context = useSelectContext()

  return (
    <>
      {context.collection.items.map((item) => {
        const label = context.collection.stringifyItem(item)
        const value = context.collection.getItemValue(item)
        return (
          <SelectItem key={value} item={item}>
            <SelectItemText>{label}</SelectItemText>
            <SelectItemIndicator />
          </SelectItem>
        )
      })}
    </>
  )
}
