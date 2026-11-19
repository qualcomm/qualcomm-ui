import type {ReactElement} from "react"

import {defineFilters, optionFilter} from "@qualcomm-ui/core/filters"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {CheckboxGroupFilter} from "@qualcomm-ui/react/filters"

const filters = defineFilters({
  status: optionFilter({
    label: "Status",
    options: ["Failed", "Passed", "Queued"],
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
