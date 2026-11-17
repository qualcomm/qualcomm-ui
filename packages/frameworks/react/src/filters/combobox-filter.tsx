// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ComponentProps, type ReactElement, useMemo, useState} from "react"

import type {
  ComboboxFilterDefinition,
  FilterPanelOption,
} from "@qualcomm-ui/core/filter-panel"
import {selectCollection} from "@qualcomm-ui/core/select"
import {useFilterPanelFilter} from "@qualcomm-ui/react-core/filter-panel"
import {useFilter} from "@qualcomm-ui/react-core/locale"
import {Combobox} from "@qualcomm-ui/react/combobox"
import {useQdsFilterPanelContext} from "@qualcomm-ui/react/filter-panel"
import type {ListCollection} from "@qualcomm-ui/utils/collection"

import {FilterSection, type FilterSectionProps} from "./filter-section.js"
import {getSelectedLabels} from "./internal/get-selected-labels.js"
import {useFilterOptions} from "./internal/use-filter-options.js"

export interface ComboboxFilterControlProps extends Omit<
  ComponentProps<typeof Combobox>,
  "collection" | "defaultValue" | "onValueChange" | "value"
> {
  /**
   * A collection to render instead of `options`. Use for custom item shapes
   * or server-side search, together with `onInputValueChange`.
   */
  collection?: ListCollection<any> | undefined

  /**
   * The options to render, filtered by the input text. Takes precedence over
   * the definition's options and the panel's resolver.
   */
  options?: FilterPanelOption[] | undefined
}

/**
 * A searchable combobox listing the filter's options.
 */
export function ComboboxFilterControl({
  collection: collectionProp,
  onInputValueChange,
  options,
  ...props
}: ComboboxFilterControlProps): ReactElement {
  const filter = useFilterPanelFilter<ComboboxFilterDefinition>()
  const qdsContext = useQdsFilterPanelContext()
  const {contains} = useFilter({sensitivity: "base"})
  const [inputValue, setInputValue] = useState("")
  const items = useFilterOptions(collectionProp ? [] : options)
  const matches = inputValue
    ? items.filter((item) => contains(item.label, inputValue))
    : items
  const matchesKey = JSON.stringify(matches)
  const optionsCollection = useMemo(
    () => selectCollection({items: matches}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [matchesKey],
  )
  const collection: ListCollection<any> = collectionProp ?? optionsCollection

  return (
    <Combobox
      aria-labelledby={filter.labelId}
      collection={collection}
      onInputValueChange={(details) => {
        setInputValue(details.inputValue)
        onInputValueChange?.(details)
      }}
      onValueChange={(details) =>
        filter.setValue(details.value, {
          labels: getSelectedLabels(collection, details.value, details.items),
        })
      }
      size={qdsContext.controlSize}
      value={filter.value ?? []}
      {...props}
    />
  )
}

export interface ComboboxFilterProps
  extends
    FilterSectionProps<ComboboxFilterDefinition>,
    Omit<ComboboxFilterControlProps, keyof FilterSectionProps> {}

/**
 * A filter that selects options from a searchable combobox. Supports
 * `multiple`. Writes a `string[]`.
 */
export function ComboboxFilter({
  contentProps,
  defaultOpen,
  filter,
  label,
  onOpenChange,
  open,
  rootProps,
  triggerProps,
  ...props
}: ComboboxFilterProps): ReactElement {
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
      <ComboboxFilterControl {...props} />
    </FilterSection>
  )
}
