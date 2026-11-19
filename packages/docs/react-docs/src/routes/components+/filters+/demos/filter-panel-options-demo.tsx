import {type ReactElement, useEffect, useState} from "react"

import {
  defineFilters,
  type FilterOption,
  optionFilter,
} from "@qualcomm-ui/core/filters"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {CheckboxGroupFilter, ComboboxFilter} from "@qualcomm-ui/react/filters"

const filters = defineFilters({
  owner: optionFilter({label: "Owner"}),
  status: optionFilter({
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

function useOwners(): FilterOption[] {
  const [options, setOptions] = useState<FilterOption[]>([])
  useEffect(() => {
    const timeout = setTimeout(() => setOptions(owners), 500)
    return () => clearTimeout(timeout)
  }, [])
  return options
}

export function FilterPanelOptionsDemo(): ReactElement {
  const ownerOptions = useOwners()

  return (
    // preview
    <FilterPanel.Root className="w-72" filters={filters}>
      {/* options from the definition */}
      <FilterPanel.Filter filter={filters.status}>
        <CheckboxGroupFilter />
      </FilterPanel.Filter>
      {/* options loaded at runtime */}
      <FilterPanel.Filter filter={filters.owner}>
        <ComboboxFilter options={ownerOptions} />
      </FilterPanel.Filter>
    </FilterPanel.Root>
    // preview
  )
}
