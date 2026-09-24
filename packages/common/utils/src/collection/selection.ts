// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {isEqual} from "@qualcomm-ui/utils/equal"

import type {ListCollection} from "./list-collection.js"

/**
 * The mode of the selection.
 *
 * - `none`: A user can't select items.
 * - `single`: A user can select a single item.
 * - `multiple`: The user can select multiple items without using modifier keys.
 * - `extended`: The user can select multiple items by using modifier keys.
 */
export type SelectionMode = "single" | "multiple" | "none" | "extended"

/**
 * @since 1.4.0
 */
export class ListSelection extends Set<string> {
  selectionMode: SelectionMode = "single"
  deselectable = true

  constructor(values: Iterable<string> = []) {
    super(values)
  }

  copy = (): ListSelection => {
    const clone = new ListSelection([...this])
    return this.sync(clone)
  }

  private sync = (other: ListSelection): ListSelection => {
    other.selectionMode = this.selectionMode
    other.deselectable = this.deselectable
    return other
  }

  isEmpty = (): boolean => {
    return this.size === 0
  }

  isSelected = (value: string | null): boolean => {
    if (this.selectionMode === "none" || value == null) {
      return false
    }
    return this.has(value)
  }

  canSelect = (collection: ListCollection, value: string): boolean => {
    return (
      this.selectionMode !== "none" ||
      !collection.getItemDisabled(collection.find(value))
    )
  }

  firstSelectedValue = (collection: ListCollection): string | null => {
    let firstValue: string | null = null
    for (const value of this) {
      if (!firstValue || collection.compareValue(value, firstValue) < 0) {
        firstValue = value
      }
    }
    return firstValue
  }

  lastSelectedValue = (collection: ListCollection): string | null => {
    let lastValue: string | null = null
    for (const value of this) {
      if (!lastValue || collection.compareValue(value, lastValue) > 0) {
        lastValue = value
      }
    }
    return lastValue
  }

  extendSelection = (
    collection: ListCollection,
    anchorValue: string,
    targetValue: string,
  ): ListSelection => {
    if (this.selectionMode === "none") {
      return this
    }

    if (this.selectionMode === "single") {
      return this.replaceSelection(collection, targetValue)
    }

    const selection = this.copy()

    const lastSelected = Array.from(this).pop()
    for (const key of collection.getValueRange(
      anchorValue,
      lastSelected ?? targetValue,
    )) {
      selection.delete(key)
    }

    for (const key of collection.getValueRange(targetValue, anchorValue)) {
      if (this.canSelect(collection, key)) {
        selection.add(key)
      }
    }

    return selection
  }

  toggleSelection = (
    collection: ListCollection,
    value: string,
  ): ListSelection => {
    if (this.selectionMode === "none") {
      return this
    }

    if (this.selectionMode === "single" && !this.isSelected(value)) {
      return this.replaceSelection(collection, value)
    }

    const selection = this.copy()
    if (selection.has(value)) {
      selection.delete(value)
    } else if (selection.canSelect(collection, value)) {
      selection.add(value)
    }

    return selection
  }

  replaceSelection = (
    collection: ListCollection,
    value: string | null,
  ): ListSelection => {
    if (this.selectionMode === "none") {
      return this
    }

    if (value == null) {
      return this
    }

    if (!this.canSelect(collection, value)) {
      return this
    }

    const selection = new ListSelection([value])
    return this.sync(selection)
  }

  setSelection = (values: Iterable<string>): ListSelection => {
    if (this.selectionMode === "none") {
      return this
    }

    const selection = new ListSelection()
    for (const value of values) {
      if (value != null) {
        selection.add(value)
        if (this.selectionMode === "single") {
          break
        }
      }
    }

    return this.sync(selection)
  }

  clearSelection = (): ListSelection => {
    const selection = this.copy()
    if (selection.deselectable && selection.size > 0) {
      selection.clear()
    }
    return selection
  }

  select = (
    collection: ListCollection,
    value: string,
    forceToggle?: boolean,
  ): ListSelection => {
    if (this.selectionMode === "none") {
      return this
    }

    if (this.selectionMode === "single") {
      if (this.isSelected(value) && this.deselectable) {
        return this.toggleSelection(collection, value)
      } else {
        return this.replaceSelection(collection, value)
      }
    } else if (this.selectionMode === "multiple" || forceToggle) {
      return this.toggleSelection(collection, value)
    } else {
      return this.replaceSelection(collection, value)
    }
  }

  deselect = (value: string): ListSelection => {
    const selection = this.copy()
    selection.delete(value)
    return selection
  }

  isEqual = (other: ListSelection): boolean => {
    return isEqual(Array.from(this), Array.from(other))
  }
}

/**
 * @deprecated migrate to {@link ListSelection}
 *
 * This conflicts with the {@link https://developer.mozilla.org/en-US/docs/Web/API/Selection Selection}
 * type and has been renamed to ListSelection for clarity.
 */
export const Selection: typeof ListSelection = ListSelection
