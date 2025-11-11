// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type CSSProperties, Fragment, type ReactElement} from "react"

import {useComboboxContext} from "@qualcomm-ui/react-core/combobox"
import {HighlightText} from "@qualcomm-ui/react-core/highlight"
import {type RenderFunction, renderProp} from "@qualcomm-ui/react-core/system"
import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {CollectionItem} from "@qualcomm-ui/utils/collection"

import {ComboboxItem, type ComboboxItemProps} from "./combobox-item"
import {ComboboxItemIndicator} from "./combobox-item-indicator"
import {ComboboxItemText} from "./combobox-item-text"

export type ComboboxItemRenderProp<T extends CollectionItem> = RenderFunction<
  Omit<ComboboxItemProps<T>, "persistFocus"> & {
    "data-virtual"?: BooleanDataAttr
    style?: CSSProperties
  }
>

export interface ComboboxItemsProps<T extends CollectionItem> {
  /**
   * Set to `true` to highlight option text matches during filtering.
   */
  highlightMatchingText?: boolean

  /**
   * Customize the rendering of the combobox list items.
   */
  renderItem?: ComboboxItemRenderProp<T>
}

/**
 * Shortcut for rendering a list of select items. Uses the {@link collection} to
 * determine the label and value for each item.
 */
export function ComboboxItems<T extends CollectionItem = CollectionItem>({
  highlightMatchingText,
  renderItem,
}: ComboboxItemsProps<T>): ReactElement {
  const context = useComboboxContext()

  if (renderItem) {
    return (
      <>
        {context.collection.items.map((item) => {
          const value = context.collection.getItemValue(item)
          return (
            <Fragment key={value}>{renderProp(renderItem, {item})}</Fragment>
          )
        })}
      </>
    )
  }

  return (
    <>
      {context.collection.items.map((item) => {
        const label = context.collection.stringifyItem(item)
        const value = context.collection.getItemValue(item)
        return (
          <Fragment key={value}>
            <ComboboxItem item={item}>
              <ComboboxItemText>
                {highlightMatchingText ? (
                  <HighlightText
                    ignoreCase
                    query={context.inputValue ?? ""}
                    text={label ?? ""}
                  />
                ) : (
                  label
                )}
              </ComboboxItemText>
              <ComboboxItemIndicator />
            </ComboboxItem>
          </Fragment>
        )
      })}
    </>
  )
}
