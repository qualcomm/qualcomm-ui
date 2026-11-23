import type {ReactElement} from "react"

import {defineFilters, listFilter} from "@qualcomm-ui/core/filters"
import {Button} from "@qualcomm-ui/react/button"
import {Drawer} from "@qualcomm-ui/react/drawer"
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

export function FilterPanelDrawerDemo(): ReactElement {
  const filterSet = useFilterSet({applyMode: "manual", filters})

  return (
    <div className="flex w-full max-w-3xl flex-wrap items-center gap-4">
      {/* preview */}
      <Drawer.Root
        onOpenChange={(open) => {
          if (!open) {
            // apply draft values when the drawer closes
            filterSet.apply()
          }
        }}
        unmountOnExit
      >
        <Drawer.Trigger>
          <Button variant="outline">Filters ({filterSet.valueCount})</Button>
        </Drawer.Trigger>
        <Drawer.FloatingPortal>
          <Drawer.Body>
            <Drawer.Heading>Filters</Drawer.Heading>
            <Drawer.CloseButton />
            <FilterPanel.RootProvider value={filterSet}>
              <FilterPanel.Filter filter={filterSet.filters.status}>
                <CheckboxGroupFilter />
              </FilterPanel.Filter>
              <FilterPanel.Filter filter={filterSet.filters.owner}>
                <ComboboxFilter />
              </FilterPanel.Filter>
            </FilterPanel.RootProvider>
          </Drawer.Body>
        </Drawer.FloatingPortal>
      </Drawer.Root>
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
      {/* preview */}
    </div>
  )
}
