// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useSelectContext} from "@qualcomm-ui/react-core/select"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {Tag} from "@qualcomm-ui/react/tag"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSelectContext} from "./qds-select-context.js"

export interface SelectValueTextProps extends ElementRenderProp<"span"> {
  /**
   * Returns the accessible label for a selected item's remove button.
   *
   * @default (itemText) => `Remove ${itemText}`
   */
  dismissLabel?: (itemText: string) => string
}

/**
 * Displays the currently selected value(s). Renders a `<span>` element by default.
 */
export function SelectValueText({
  dismissLabel = (itemText) => `Remove ${itemText}`,
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
      {!multiple ? (
        valueAsString || placeholder
      ) : (
        <SelectTags dismissLabel={dismissLabel} />
      )}
    </PolymorphicElement>
  )
}

function SelectTags({
  dismissLabel,
}: {
  dismissLabel: (itemText: string) => string
}) {
  const {collection, placeholder, selectValue, value} = useSelectContext()

  if (!value.length) {
    return placeholder
  }

  return (
    <>
      {value.map((item) => {
        const label = collection.stringifyItem(item) ?? ""
        return (
          <Tag
            key={item}
            dismissLabel={dismissLabel(label)}
            emphasis="neutral"
            onClick={(event) => {
              event.stopPropagation()
              selectValue(item)
            }}
            variant="dismissable"
          >
            {label}
          </Tag>
        )
      })}
    </>
  )
}
