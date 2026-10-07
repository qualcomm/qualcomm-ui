// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Fragment, type ReactElement} from "react"

import {useComboboxContext} from "@qualcomm-ui/react-core/combobox"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {Tag} from "@qualcomm-ui/react/tag"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface ComboboxTagsProps extends ElementRenderProp<"div"> {}

export function ComboboxInputTags({
  id,
  ...props
}: ComboboxTagsProps): ReactElement | null {
  const {
    collection,
    getInputSelectionTagBindings,
    getInputTagBindings,
    getInputTagContainerBindings,
    getInvisibleInputTagBindings,
    getInvisibleOverflowTagBindings,
    getOverflowTagBindings,
    overflowTagCount,
    value,
  } = useComboboxContext()

  const mergedProps = mergeProps(
    getInputTagContainerBindings({id: useControlledId(id)}),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {value.map((item) => {
        const label = collection.stringifyItem(item)
        return (
          <Fragment key={item}>
            <Tag
              {...getInputTagBindings(item)}
              emphasis="neutral"
              variant="dismissable"
            >
              {label}
            </Tag>
            <Tag
              {...getInvisibleInputTagBindings(item)}
              emphasis="neutral"
              variant="dismissable"
            >
              {label}
            </Tag>
          </Fragment>
        )
      })}
      {/* TODO: this used to take an id in the old API, figure out if still necessary */}
      <Tag {...getOverflowTagBindings()} emphasis="neutral">
        +{overflowTagCount}
      </Tag>
      <Tag {...getInvisibleOverflowTagBindings()} emphasis="neutral">
        +{value.length}
      </Tag>
      <Tag {...getInputSelectionTagBindings()} emphasis="neutral">
        Selected ({value.length})
      </Tag>
    </PolymorphicElement>
  )
}
