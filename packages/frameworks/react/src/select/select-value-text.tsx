// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useRef} from "react"

import {Tag} from "@qualcomm-ui/react/tag"
import {useOverflowItems} from "@qualcomm-ui/react-core/dom"
import {useSelectContext} from "@qualcomm-ui/react-core/select"
import {
  bindingRenderProp,
  type ElementRenderProp,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSelectContext} from "./qds-select-context"
import {SelectOverflowIndicator} from "./select-overflow-indicator"

export interface SelectValueTextProps extends ElementRenderProp<"span"> {}

/**
 * Displays the currently selected value(s). Renders a `<span>` element by default.
 */
export function SelectValueText({
  render,
  ...props
}: SelectValueTextProps): ReactElement {
  const {
    collection,
    getValueTextBindings,
    multiple,
    placeholder,
    selectValue,
    value,
    valueAsString,
  } = useSelectContext()
  const {getValueTextBindings: getQdsBindings, maxTagCount} =
    useQdsSelectContext()
  const containerRef = useRef<HTMLSpanElement>(null)

  const isResponsive = maxTagCount === "responsive"

  const {measureRef, visibleItems} = useOverflowItems({
    containerRef,
    items: isResponsive ? value : [],
  })

  const mergedProps = mergeProps(
    getValueTextBindings(),
    getQdsBindings(),
    {
      "data-tag-wrap":
        multiple && maxTagCount !== undefined ? "nowrap" : undefined,
      ref: multiple ? containerRef : undefined,
    },
    props,
  )

  let content: ReactElement | string
  if (!multiple) {
    content = valueAsString || placeholder
  } else if (!value.length) {
    content = placeholder
  } else {
    let displayItems: string[]
    let hiddenCount: number

    if (typeof maxTagCount === "number") {
      displayItems = maxTagCount === 0 ? [] : value.slice(0, maxTagCount)
      hiddenCount = Math.max(0, value.length - (maxTagCount || 0))
    } else if (isResponsive) {
      displayItems = visibleItems
      hiddenCount = value.length - visibleItems.length
    } else {
      displayItems = value
      hiddenCount = 0
    }

    content = (
      <>
        {displayItems.map((item) => (
          <Tag
            key={item}
            ref={isResponsive ? (el) => measureRef(item, el) : undefined}
            data-select-tag=""
            emphasis="neutral"
            onDismiss={() => selectValue(item)}
            variant="dismissable"
          >
            {collection.stringifyItem(item) ?? item}
          </Tag>
        ))}
        {hiddenCount > 0 && <SelectOverflowIndicator count={hiddenCount} />}
      </>
    )
  }

  const elementProps = {...mergedProps, children: content}

  if (render) {
    return bindingRenderProp(render, elementProps)
  }

  return <span {...elementProps} />
}
