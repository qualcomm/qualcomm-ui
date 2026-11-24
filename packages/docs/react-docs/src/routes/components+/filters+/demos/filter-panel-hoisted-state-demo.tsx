import type {ReactElement} from "react"

import {defineFilters, listFilter} from "@qualcomm-ui/core/filters"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {
  CheckboxGroupFilter,
  ComboboxFilter,
  useFilterSet,
} from "@qualcomm-ui/react/filters"
import {Tag} from "@qualcomm-ui/react/tag"
import {ListCollection} from "@qualcomm-ui/utils/collection"

const owners = [
  {label: "Anna Robinson", value: "u1"},
  {label: "Ben Ortiz", value: "u2"},
  {label: "Chloe Nguyen", value: "u3"},
  {label: "Dev Patel", value: "u4"},
]

const filters = defineFilters({
  owner: listFilter({
    collection: new ListCollection({items: owners}),
    label: "Owner",
  }),
  status: listFilter({
    collection: new ListCollection({items: ["Failed", "Passed", "Queued"]}),
    label: "Status",
  }),
})

export function FilterPanelHoistedStateDemo(): ReactElement {
  // preview
  const filterSet = useFilterSet({filters})

  return (
    <div className="flex w-full max-w-3xl flex-wrap items-start gap-6">
      <FilterPanel.RootProvider className="w-72" value={filterSet}>
        <FilterPanel.Filter filter={filters.status}>
          <CheckboxGroupFilter />
        </FilterPanel.Filter>
        <FilterPanel.Filter filter={filters.owner}>
          <ComboboxFilter />
        </FilterPanel.Filter>
      </FilterPanel.RootProvider>
      <div className="flex min-w-60 flex-1 flex-wrap gap-2">
        {filterSet.getValueItems().map((item) => (
          <Tag
            key={`${item.filterId}:${item.value}`}
            onDismiss={() =>
              filterSet.removeFilterValue(item.filterId, item.value)
            }
            variant="dismissable"
          >
            {item.label}
          </Tag>
        ))}
      </div>
    </div>
  )
  // preview
}
