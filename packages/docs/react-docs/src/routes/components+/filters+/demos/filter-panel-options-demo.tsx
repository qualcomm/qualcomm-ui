// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useQuery, useQueryClient} from "@tanstack/react-query"

import {defineFilters, listFilter} from "@qualcomm-ui/core/filters"
import {Button} from "@qualcomm-ui/react/button"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {CheckboxGroupFilter} from "@qualcomm-ui/react/filters"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
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
  const queryClient = useQueryClient()
  const owners = useQuery({
    queryFn: fetchOwners,
    queryKey: ["owners"],
    select: toCollection,
  })

  return (
    <div className="flex flex-col gap-4">
      {/* preview */}
      <FilterPanel.Root
        className="w-72"
        filters={filters}
        getFilterCollection={(id) => (id === "owner" ? owners.data : undefined)}
      >
        <FilterPanel.Filter
          filter={filters.owner}
          label={(label) => (
            <span className="inline-flex items-center gap-2">
              {label}
              {owners.isPending ? (
                <ProgressRing aria-label="Loading owners" size="xs" />
              ) : null}
            </span>
          )}
        >
          {owners.isError ? (
            <div className="flex items-center gap-2">
              <span className="font-body-xs text-neutral-secondary">
                Could not load owners
              </span>
              <Button
                onClick={() => void owners.refetch()}
                size="sm"
                variant="ghost"
              >
                Retry
              </Button>
            </div>
          ) : (
            <CheckboxGroupFilter />
          )}
        </FilterPanel.Filter>
      </FilterPanel.Root>
      {/* preview */}
      <Button
        className="self-start"
        onClick={() => void queryClient.resetQueries({queryKey: ["owners"]})}
        variant="outline"
      >
        Reset
      </Button>
    </div>
  )
}
