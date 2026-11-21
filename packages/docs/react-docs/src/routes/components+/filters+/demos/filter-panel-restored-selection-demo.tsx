// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useQuery, useQueryClient} from "@tanstack/react-query"

import type {FilterSetCollectionState} from "@qualcomm-ui/core/filter-set"
import {defineFilters, listFilter} from "@qualcomm-ui/core/filters"
import {Button} from "@qualcomm-ui/react/button"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {CheckboxGroupFilter, useFilterSet} from "@qualcomm-ui/react/filters"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import {Tag} from "@qualcomm-ui/react/tag"
import {ListCollection} from "@qualcomm-ui/utils/collection"

import {fetchOwners, type Owner} from "./mock-api"

const filters = defineFilters({
  owner: listFilter<Owner>({label: "Owner"}),
})

/**
 * The selection from `/builds?owner=u2&owner=u3`. This simulates an active
 * selection from the URL.
 */
const restoredValue = {owner: ["u2", "u3"]}

function toCollection(owners: Owner[]): ListCollection<Owner> {
  return new ListCollection({items: owners})
}

export function FilterPanelRestoredSelectionDemo(): ReactElement {
  const queryClient = useQueryClient()
  const owners = useQuery({
    queryFn: fetchOwners,
    queryKey: ["owners"],
    select: toCollection,
  })

  const filterSet = useFilterSet({
    defaultValue: restoredValue,
    filters,
    getFilterCollection: (id): FilterSetCollectionState | undefined => {
      if (id !== "owner") {
        return undefined
      }
      return owners.data
        ? {collection: owners.data, status: "success"}
        : {status: "loading"}
    },
  })

  function reload() {
    filterSet.setFilterValue("owner", restoredValue.owner)
    void queryClient.resetQueries({queryKey: ["owners"]})
  }

  return (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      <div className="flex flex-wrap items-start gap-6">
        {/* preview */}
        <FilterPanel.RootProvider className="w-72" value={filterSet}>
          <FilterPanel.Filter filter={filters.owner}>
            <CheckboxGroupFilter />
          </FilterPanel.Filter>
        </FilterPanel.RootProvider>
        <div className="flex min-w-60 flex-1 flex-wrap gap-2">
          {owners.isPending ? (
            <ProgressRing aria-label="Loading owners" size="xs" />
          ) : (
            filterSet.getValueItems("owner").map((item) => (
              <Tag
                key={item.value}
                onDismiss={() =>
                  filterSet.removeFilterValue("owner", item.value)
                }
                variant="dismissable"
              >
                {item.label}
              </Tag>
            ))
          )}
        </div>
        {/* preview */}
      </div>
      <Button className="self-start" onClick={reload} variant="outline">
        Reload
      </Button>
    </div>
  )
}
