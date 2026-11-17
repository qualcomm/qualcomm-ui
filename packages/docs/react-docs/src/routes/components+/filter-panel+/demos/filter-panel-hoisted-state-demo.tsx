import type {ReactElement} from "react"

import {FilterPanel, useFilterPanel} from "@qualcomm-ui/react/filter-panel"
import {CheckboxFilter, ComboboxFilter} from "@qualcomm-ui/react/filters"
import {Tag} from "@qualcomm-ui/react/tag"

import {filters, owners} from "./filters"

export function FilterPanelHoistedStateDemo(): ReactElement {
  const panel = useFilterPanel({filters})
  const activeIds = Object.keys(panel.value) as (keyof typeof filters)[]

  return (
    <div className="flex w-full max-w-3xl flex-wrap items-start gap-6">
      {/* preview */}
      <FilterPanel.RootProvider className="w-72" value={panel}>
        <CheckboxFilter filter={filters.status} />
        <ComboboxFilter filter={filters.owner} options={owners} />
      </FilterPanel.RootProvider>
      <div className="flex min-w-60 flex-1 flex-wrap gap-2">
        {activeIds.map((id) => (
          <Tag
            key={id}
            onDismiss={() => panel.clearFilter(id)}
            variant="dismissable"
          >
            {panel.getFilterLabel(id)}:{" "}
            {panel.getValueLabels(id, panel.value[id]).join(", ")}
          </Tag>
        ))}
      </div>
      {/* preview */}
    </div>
  )
}
