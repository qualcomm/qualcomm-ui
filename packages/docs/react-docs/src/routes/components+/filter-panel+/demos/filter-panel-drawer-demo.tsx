import type {ReactElement} from "react"

import {
  checkboxFilter,
  comboboxFilter,
  defineFilters,
} from "@qualcomm-ui/core/filters"
import {Button} from "@qualcomm-ui/react/button"
import {Drawer} from "@qualcomm-ui/react/drawer"
import {FilterPanel, useFilterPanel} from "@qualcomm-ui/react/filter-panel"
import {CheckboxFilter, ComboboxFilter} from "@qualcomm-ui/react/filters"
import {Tag} from "@qualcomm-ui/react/tag"

const filters = defineFilters({
  owner: comboboxFilter({label: "Owner"}),
  status: checkboxFilter({
    label: "Status",
    options: ["Failed", "Passed", "Queued"],
  }),
})

const owners = [
  {label: "Anna Robinson", value: "u1"},
  {label: "Ben Ortiz", value: "u2"},
  {label: "Chloe Nguyen", value: "u3"},
  {label: "Dev Patel", value: "u4"},
]

export function FilterPanelDrawerDemo(): ReactElement {
  const panel = useFilterPanel({filters})
  const activeIds = Object.keys(panel.value) as (keyof typeof filters)[]

  return (
    <div className="flex w-full max-w-3xl flex-wrap items-center gap-4">
      {/* preview */}
      <Drawer.Root>
        <Drawer.Trigger>
          <Button variant="outline">Filters ({panel.valueCount})</Button>
        </Drawer.Trigger>
        <Drawer.FloatingPortal>
          <Drawer.Body>
            <Drawer.Heading>Filters</Drawer.Heading>
            <Drawer.CloseButton />
            <FilterPanel.RootProvider value={panel}>
              <CheckboxFilter filter={filters.status} />
              <ComboboxFilter filter={filters.owner} options={owners} />
            </FilterPanel.RootProvider>
          </Drawer.Body>
        </Drawer.FloatingPortal>
      </Drawer.Root>
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
      {/* preview */}
    </div>
  )
}
