import type {ReactElement} from "react"

import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {CheckboxFilter} from "@qualcomm-ui/react/filters"

import {filters} from "./filters"

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
