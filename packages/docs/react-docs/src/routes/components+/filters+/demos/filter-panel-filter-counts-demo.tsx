import {type ReactElement, useState} from "react"

import {getFacetFilterSetProps} from "@qualcomm-ui/core/filter-set"
import {
  defineFilters,
  type FilterValues,
  listFilter,
  textFilter,
} from "@qualcomm-ui/core/filters"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {
  CheckboxGroupFilter,
  RadioGroupFilter,
  TextInputFilter,
} from "@qualcomm-ui/react/filters"
import {ListCollection} from "@qualcomm-ui/utils/collection"
import {FacetIndex} from "@qualcomm-ui/utils/facet-index"

const builds = [
  {id: "1", mode: "debug", name: "android-arm64", status: "Failed"},
  {id: "2", mode: "release", name: "android-x86", status: "Passed"},
  {id: "3", mode: "debug", name: "ios-simulator", status: "Queued"},
  {id: "4", mode: "release", name: "linux-gcc", status: "Passed"},
  {id: "5", mode: "test", name: "linux-clang", status: "Failed"},
  {id: "6", mode: "debug", name: "windows-msvc", status: "Passed"},
  {id: "7", mode: "release", name: "windows-arm64", status: "Queued"},
  {id: "8", mode: "test", name: "macos-arm64", status: "Passed"},
]

const filters = defineFilters({
  mode: listFilter({
    collection: new ListCollection({
      items: [
        {label: "Debug", value: "debug"},
        {label: "Test", value: "test"},
        {label: "Release", value: "release"},
      ],
    }),
    label: "Build mode",
  }),
  name: textFilter({label: "Name"}),
  status: listFilter({
    collection: new ListCollection({items: ["Failed", "Passed", "Queued"]}),
    label: "Status",
  }),
})

type BuildFilters = FilterValues<typeof filters>

const facetIndex = new FacetIndex(builds, {
  fields: {mode: {}, status: {}},
})

/**
 * The text filter isn't a facet, so it narrows the candidates instead.
 */
function matchName(values: BuildFilters): string[] | undefined {
  const query = values.name?.toLowerCase()
  return query
    ? builds
        .filter((build) => build.name.includes(query))
        .map((build) => build.id)
    : undefined
}

const facetProps = getFacetFilterSetProps<typeof filters>(facetIndex, {
  getCandidateIds: matchName,
})

export function FilterPanelFilterCountsDemo(): ReactElement {
  const [value, setValue] = useState<BuildFilters>({})
  const {ids} = facetIndex.filter({
    ids: matchName(value),
    selections: {mode: value.mode ?? [], status: value.status ?? []},
  })

  return (
    <div className="flex w-full max-w-3xl flex-wrap items-start gap-6">
      {/* preview */}
      <FilterPanel.Root
        className="w-72"
        filters={filters}
        onValueChange={setValue}
        value={value}
        {...facetProps}
      >
        <FilterPanel.Filter filter={filters.name}>
          <TextInputFilter />
        </FilterPanel.Filter>
        <FilterPanel.Filter filter={filters.status}>
          <CheckboxGroupFilter />
        </FilterPanel.Filter>
        <FilterPanel.Filter filter={filters.mode}>
          <RadioGroupFilter />
        </FilterPanel.Filter>
      </FilterPanel.Root>
      <ul className="text-neutral-primary font-body-md min-w-60 flex-1">
        {builds
          .filter((build) => ids.includes(build.id))
          .map((build) => (
            <li key={build.id}>{build.name}</li>
          ))}
      </ul>
      {/* preview */}
    </div>
  )
}
