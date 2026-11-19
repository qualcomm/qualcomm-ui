// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useEffect, useState} from "react"

import type {FilterSetCollectionState} from "@qualcomm-ui/core/filter-set"
import {defineFilters, listFilter} from "@qualcomm-ui/core/filters"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {CheckboxGroupFilter} from "@qualcomm-ui/react/filters"
import {ListCollection} from "@qualcomm-ui/utils/collection"

const filters = defineFilters({
  owner: listFilter({label: "Owner"}),
  status: listFilter({
    collection: new ListCollection({items: ["Failed", "Passed", "Queued"]}),
    label: "Status",
  }),
})

const owners = new ListCollection({
  items: [
    {label: "Anna Robinson", value: "u1"},
    {label: "Ben Ortiz", value: "u2"},
    {label: "Chloe Nguyen", value: "u3"},
    {label: "Dev Patel", value: "u4"},
  ],
})

/**
 * Stands in for a request, such as a query library's `useQuery`.
 */
function useOwners(): FilterSetCollectionState {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), 1500)
    return () => clearTimeout(timeout)
  }, [])
  return loaded ? {collection: owners, status: "success"} : {status: "loading"}
}

export function FilterPanelOptionsDemo(): ReactElement {
  const ownersState = useOwners()

  return (
    // preview
    <FilterPanel.Root
      className="w-72"
      filters={filters}
      getFilterCollection={(id) => (id === "owner" ? ownersState : undefined)}
    >
      {/* collection from the definition */}
      <FilterPanel.Filter filter={filters.status}>
        <CheckboxGroupFilter />
      </FilterPanel.Filter>
      {/* collection loaded at runtime */}
      <FilterPanel.Filter filter={filters.owner}>
        <CheckboxGroupFilter />
      </FilterPanel.Filter>
    </FilterPanel.Root>
    // preview
  )
}
