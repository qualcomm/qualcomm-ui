import {type ReactElement, useState} from "react"

import {keepPreviousData, useQuery} from "@tanstack/react-query"

import {
  type FacetFilterSetProps,
  getFacetFilterSetProps,
} from "@qualcomm-ui/core/filter-set"
import {
  defineFilters,
  type FilterValues,
  listFilter,
} from "@qualcomm-ui/core/filters"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {CheckboxGroupFilter} from "@qualcomm-ui/react/filters"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import {FacetIndex} from "@qualcomm-ui/utils/facet-index"

import {type Build, fetchBuilds} from "./mock-api"

const filters = defineFilters({
  platform: listFilter({label: "Platform"}),
  status: listFilter({label: "Status"}),
})

type BuildFilters = FilterValues<typeof filters>

function indexBuilds(builds: Build[]): FacetFilterSetProps<typeof filters> {
  return getFacetFilterSetProps<typeof filters>(
    new FacetIndex(builds, {fields: {platform: {}, status: {}}}),
  )
}

export function FilterPanelAsyncFacetsDemo(): ReactElement {
  const [value, setValue] = useState<BuildFilters>({})

  /**
   * The index is built from the unfiltered results, so it counts every value
   * of a field, and values don't drop out as the filters narrow the results.
   */
  const facets = useQuery({
    queryFn: () => fetchBuilds({}),
    queryKey: ["builds"],
    select: indexBuilds,
  })
  const results = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => fetchBuilds(value),
    queryKey: ["builds", value],
  })

  return (
    <div className="flex w-full max-w-3xl flex-wrap items-start gap-6">
      {/* preview */}
      <FilterPanel.Root
        className="w-72"
        filters={filters}
        getFilterCollection={(id) => facets.data?.getFilterCollection(id)}
        getFilterOptionCounts={(id, values) =>
          facets.data?.getFilterOptionCounts(id, values)
        }
        onValueChange={setValue}
        value={value}
      >
        <FilterPanel.Filter
          filter={filters.status}
          label={(label) => (
            <span className="inline-flex items-center gap-2">
              {label}
              {facets.isPending ? (
                <ProgressRing aria-label="Loading statuses" size="xs" />
              ) : null}
            </span>
          )}
        >
          <CheckboxGroupFilter />
        </FilterPanel.Filter>
        <FilterPanel.Filter
          filter={filters.platform}
          label={(label) => (
            <span className="inline-flex items-center gap-2">
              {label}
              {facets.isPending ? (
                <ProgressRing aria-label="Loading platforms" size="xs" />
              ) : null}
            </span>
          )}
        >
          <CheckboxGroupFilter />
        </FilterPanel.Filter>
      </FilterPanel.Root>
      {/* preview */}
      <div className="flex flex-col gap-2">
        <div className="text-neutral-primary font-body-md">
          <span>Builds: </span>
          <span>{results.data?.length}</span>
        </div>
        {results.data ? (
          <ul className="text-neutral-primary font-body-md min-w-60 flex-1">
            {results.data.map((build) => (
              <li key={build.id}>{build.name}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}
