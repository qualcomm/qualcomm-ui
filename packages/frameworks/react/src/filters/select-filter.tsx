// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentProps, ReactElement} from "react"

import type {ListFilterDefinition} from "@qualcomm-ui/core/filters"
import {Select} from "@qualcomm-ui/react/select"
import {ListCollection} from "@qualcomm-ui/utils/collection"

import {
  getFilterLabelProps,
  useFilterWidget,
} from "./internal/use-filter-widget.js"
import {useQdsFilterControlContext} from "./qds-filter-control-context.js"

export interface SelectFilterProps extends Omit<
  ComponentProps<typeof Select>,
  "collection" | "defaultValue" | "onValueChange" | "value"
> {}

const emptyCollection = new ListCollection<any>({items: []})

/**
 * A select listing the items of the filter's list collection. Supports
 * `multiple`. Writes a `string[]`.
 */
export function SelectFilter({
  controlProps,
  ...props
}: SelectFilterProps): ReactElement {
  const filter = useFilterWidget<ListFilterDefinition>("SelectFilter", "list")
  const qdsContext = useQdsFilterControlContext()
  const labelProps = getFilterLabelProps(filter)

  return (
    <Select
      {...labelProps}
      collection={
        filter.collection instanceof ListCollection
          ? filter.collection
          : emptyCollection
      }
      controlProps={{...labelProps, ...controlProps}}
      onValueChange={(value) => filter.setValue(value)}
      size={qdsContext.size}
      value={filter.value ?? []}
      {...props}
    />
  )
}
