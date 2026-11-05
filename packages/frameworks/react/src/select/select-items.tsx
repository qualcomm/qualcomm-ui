// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useSelectContext} from "@qualcomm-ui/react-core/select"

import {useQdsSelectContext} from "./qds-select-context.js"
import {SelectItemCheckbox} from "./select-item-checkbox.js"
import {SelectItemIndicator} from "./select-item-indicator.js"
import {SelectItemText} from "./select-item-text.js"
import {SelectItem} from "./select-item.js"

/**
 * Shortcut for rendering a list of select items. Uses the {@link collection} to
 * determine the label and value for each item.
 */
export function SelectItems(): ReactElement {
  const context = useSelectContext()
  const qdsContext = useQdsSelectContext()
  const useCheckbox =
    qdsContext.selectionIndicator === "checkbox" && context.multiple

  return (
    <>
      {context.collection.items.map((item) => {
        const label = context.collection.stringifyItem(item)
        const value = context.collection.getItemValue(item)
        return (
          <SelectItem key={value} item={item}>
            {useCheckbox ? <SelectItemCheckbox /> : null}
            <SelectItemText>{label}</SelectItemText>
            {useCheckbox ? null : <SelectItemIndicator />}
          </SelectItem>
        )
      })}
    </>
  )
}
