// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ComponentProps, type ReactElement, useMemo} from "react"

import type {
  FilterOption,
  OptionFilterDefinition,
} from "@qualcomm-ui/core/filters"
import {selectCollection} from "@qualcomm-ui/core/select"
import {Select} from "@qualcomm-ui/react/select"
import type {ListCollection} from "@qualcomm-ui/utils/collection"

import {getSelectedLabels} from "./internal/get-selected-labels.js"
import {useFilterOptions} from "./internal/use-filter-options.js"
import {
  getFilterLabelProps,
  useFilterWidget,
} from "./internal/use-filter-widget.js"
import {useQdsFilterControlContext} from "./qds-filter-control-context.js"

export interface SelectFilterProps extends Omit<
  ComponentProps<typeof Select>,
  "collection" | "defaultValue" | "onValueChange" | "value"
> {
  /**
   * A collection to render instead of `options`. Use for custom item shapes.
   */
  collection?: ListCollection<any> | undefined

  /**
   * The options to render. Takes precedence over the definition's options and
   * the filter set's resolver.
   */
  options?: FilterOption[] | undefined
}

/**
 * A select listing the filter's options. Supports `multiple`. Writes a
 * `string[]`.
 */
export function SelectFilter({
  collection: collectionProp,
  controlProps,
  options,
  ...props
}: SelectFilterProps): ReactElement {
  const filter = useFilterWidget<OptionFilterDefinition>(
    "SelectFilter",
    "option",
  )
  const qdsContext = useQdsFilterControlContext()
  const items = useFilterOptions(collectionProp ? [] : options)
  const itemsKey = JSON.stringify(items)
  const optionsCollection = useMemo(
    () => selectCollection({items}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [itemsKey],
  )
  const collection = collectionProp ?? optionsCollection
  const labelProps = getFilterLabelProps(filter)

  return (
    <Select
      {...labelProps}
      collection={collection}
      controlProps={{...labelProps, ...controlProps}}
      onValueChange={(value, details) =>
        filter.setValue(value, {
          labels: getSelectedLabels(collection, value, details.items),
        })
      }
      size={qdsContext.size}
      value={filter.value ?? []}
      {...props}
    />
  )
}
