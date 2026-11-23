import type {ReactElement} from "react"

import {defineFilters, listFilter} from "@qualcomm-ui/core/filters"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {CheckboxGroupFilter, RadioGroupFilter} from "@qualcomm-ui/react/filters"
import {ListCollection} from "@qualcomm-ui/utils/collection"

const filters = defineFilters({
  architecture: listFilter({
    collection: new ListCollection({items: ["arm64", "x86-64"]}),
    label: "Architecture",
  }),
  platform: listFilter({
    collection: new ListCollection({items: ["Linux", "macOS", "Windows"]}),
    label: "Platform",
  }),
  status: listFilter({
    collection: new ListCollection({items: ["Failed", "Passed", "Queued"]}),
    label: "Status",
  }),
})

export function FilterPanelDefiningFiltersDemo(): ReactElement {
  return (
    // preview
    <FilterPanel.Root className="w-72" filters={filters}>
      <FilterPanel.Filter filter={filters.status}>
        <CheckboxGroupFilter />
      </FilterPanel.Filter>
      <FilterPanel.Filter filter={filters.architecture}>
        <RadioGroupFilter />
      </FilterPanel.Filter>
      <FilterPanel.Filter filter={filters.platform}>
        <CheckboxGroupFilter />
      </FilterPanel.Filter>
    </FilterPanel.Root>
    // preview
  )
}
