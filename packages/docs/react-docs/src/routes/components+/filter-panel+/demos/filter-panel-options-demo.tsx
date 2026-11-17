import {type ReactElement, useEffect, useState} from "react"

import type {FilterOption} from "@qualcomm-ui/core/filters"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {CheckboxFilter, ComboboxFilter} from "@qualcomm-ui/react/filters"

import {filters, owners} from "./filters"

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
      <CheckboxFilter filter={filters.status} />
      {/* options loaded at runtime */}
      <ComboboxFilter filter={filters.owner} options={ownerOptions} />
    </FilterPanel.Root>
    // preview
  )
}
