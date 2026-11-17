// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ComponentProps, type ReactElement, useMemo} from "react"

import type {
  FilterPanelOption,
  SelectFilterDefinition,
} from "@qualcomm-ui/core/filter-panel"
import {selectCollection} from "@qualcomm-ui/core/select"
import {useFilterPanelFilter} from "@qualcomm-ui/react-core/filter-panel"
import {useQdsFilterPanelContext} from "@qualcomm-ui/react/filter-panel"
import {Select} from "@qualcomm-ui/react/select"
import type {ListCollection} from "@qualcomm-ui/utils/collection"

import {FilterSection, type FilterSectionProps} from "./filter-section.js"
import {getSelectedLabels} from "./internal/get-selected-labels.js"
import {useFilterOptions} from "./internal/use-filter-options.js"

export interface SelectFilterControlProps extends Omit<
  ComponentProps<typeof Select>,
  "collection" | "defaultValue" | "onValueChange" | "value"
> {
  /**
   * A collection to render instead of `options`. Use for custom item shapes.
   */
  collection?: ListCollection<any> | undefined

  /**
   * The options to render. Takes precedence over the definition's options and
   * the panel's resolver.
   */
  options?: FilterPanelOption[] | undefined
}

/**
 * A select listing the filter's options.
 */
export function SelectFilterControl({
  collection: collectionProp,
  controlProps,
  options,
  ...props
}: SelectFilterControlProps): ReactElement {
  const filter = useFilterPanelFilter<SelectFilterDefinition>()
  const qdsContext = useQdsFilterPanelContext()
  const items = useFilterOptions(collectionProp ? [] : options)
  const itemsKey = JSON.stringify(items)
  const optionsCollection = useMemo(
    () => selectCollection({items}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [itemsKey],
  )
  const collection = collectionProp ?? optionsCollection

  return (
    <Select
      aria-labelledby={filter.labelId}
      collection={collection}
      controlProps={{"aria-labelledby": filter.labelId, ...controlProps}}
      onValueChange={(value, details) =>
        filter.setValue(value, {
          labels: getSelectedLabels(collection, value, details.items),
        })
      }
      size={qdsContext.controlSize}
      value={filter.value ?? []}
      {...props}
    />
  )
}

export interface SelectFilterProps
  extends
    FilterSectionProps<SelectFilterDefinition>,
    Omit<SelectFilterControlProps, keyof FilterSectionProps> {}

/**
 * A filter that selects options from a select. Supports `multiple`. Writes a
 * `string[]`.
 */
export function SelectFilter({
  contentProps,
  defaultOpen,
  filter,
  label,
  onOpenChange,
  open,
  rootProps,
  triggerProps,
  ...props
}: SelectFilterProps): ReactElement {
  return (
    <FilterSection
      contentProps={contentProps}
      defaultOpen={defaultOpen}
      filter={filter}
      label={label}
      onOpenChange={onOpenChange}
      open={open}
      rootProps={rootProps}
      triggerProps={triggerProps}
    >
      <SelectFilterControl {...props} />
    </FilterSection>
  )
}
