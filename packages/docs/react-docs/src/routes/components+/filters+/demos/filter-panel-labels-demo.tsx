import type {ReactElement} from "react"

import {defineFilters, listFilter} from "@qualcomm-ui/core/filters"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {CheckboxGroupFilter} from "@qualcomm-ui/react/filters"
import {ListCollection} from "@qualcomm-ui/utils/collection"

const filters = defineFilters({
  status: listFilter({
    collection: new ListCollection({items: ["Failed", "Passed", "Queued"]}),
    label: "Status",
  }),
})

export function FilterPanelLabelsDemo(): ReactElement {
  return (
    // preview
    <FilterPanel.Root className="w-72" filters={filters}>
      <FilterPanel.Filter
        filter={filters.status}
        label={(label) => (
          <>
            {label}{" "}
            <span className="font-body-xs text-neutral-secondary">
              (last run)
            </span>
          </>
        )}
      >
        <CheckboxGroupFilter />
      </FilterPanel.Filter>
    </FilterPanel.Root>
    // preview
  )
}
