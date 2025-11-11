// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Tag} from "@qualcomm-ui/react/tag"
import {useSelectContext} from "@qualcomm-ui/react-core/select"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSelectContext} from "./qds-select-context"

export interface SelectValueTextProps extends ElementRenderProp<"span"> {}

/**
 * Displays the currently selected value(s). Renders a `<span>` element by default.
 */
export function SelectValueText({
  ...props
}: SelectValueTextProps): ReactElement {
  const {getValueTextBindings, multiple, placeholder, valueAsString} =
    useSelectContext()
  const qdsSelectContext = useQdsSelectContext()

  const mergedProps = mergeProps(
    getValueTextBindings(),
    qdsSelectContext.getValueTextBindings(),
    props,
  )

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {!multiple ? valueAsString || placeholder : <SelectTags />}
    </PolymorphicElement>
  )
}

function SelectTags() {
  const {collection, placeholder, selectValue, value} = useSelectContext()

  if (!value.length) {
    return placeholder
  }

  return (
    <>
      {value.map((item) => (
        <Tag
          key={item}
          emphasis="neutral"
          onClick={(event) => {
            event.stopPropagation()
            selectValue(item)
          }}
          variant="dismissable"
        >
          {collection.stringifyItem(item)}
        </Tag>
      ))}
    </>
  )
}
