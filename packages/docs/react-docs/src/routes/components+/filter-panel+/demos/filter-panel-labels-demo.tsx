import type {ReactElement} from "react"

import {checkboxFilter, defineFilters} from "@qualcomm-ui/core/filters"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {CheckboxFilter} from "@qualcomm-ui/react/filters"

const filters = defineFilters({
  status: checkboxFilter({
    label: "Status",
    options: ["Failed", "Passed", "Queued"],
  }),
})

export function FilterPanelLabelsDemo(): ReactElement {
  return (
    // preview
    <FilterPanel.Root className="w-72" filters={filters}>
      <CheckboxFilter
        filter={filters.status}
        label={(label) => (
          <>
            {label}{" "}
            <span className="font-body-xs text-neutral-secondary">
              (last run)
            </span>
          </>
        )}
      />
    </FilterPanel.Root>
    // preview
  )
}
