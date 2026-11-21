// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useQuery} from "@tanstack/react-query"

import type {FilterSetCollectionState} from "@qualcomm-ui/core/filter-set"
import {defineFilters, listFilter} from "@qualcomm-ui/core/filters"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {CheckboxGroupFilter} from "@qualcomm-ui/react/filters"
import {ListCollection} from "@qualcomm-ui/utils/collection"

import {fetchOwners, type Owner} from "./mock-api"

const filters = defineFilters({
  owner: listFilter({label: "Owner"}),
})

/**
 * Defined outside the component so the query keeps the same collection
 * between renders.
 */
function toCollection(owners: Owner[]): ListCollection<Owner> {
  return new ListCollection({items: owners})
}

export function FilterPanelOptionsDemo(): ReactElement {
  const owners = useQuery({
    queryFn: fetchOwners,
    queryKey: ["owners"],
    select: toCollection,
  })

  function getFilterCollection(
    id: string,
  ): FilterSetCollectionState | undefined {
    if (id !== "owner") {
      return undefined
    }
    if (owners.isError) {
      return {
        error: owners.error,
        retry: () => void owners.refetch(),
        status: "error",
      }
    }
    return owners.data
      ? {collection: owners.data, status: "success"}
      : {status: "loading"}
  }

  return (
    // preview
    <FilterPanel.Root
      className="w-72"
      filters={filters}
      getFilterCollection={getFilterCollection}
    >
      <FilterPanel.Filter filter={filters.owner}>
        <CheckboxGroupFilter />
      </FilterPanel.Filter>
    </FilterPanel.Root>
    // preview
  )
}
