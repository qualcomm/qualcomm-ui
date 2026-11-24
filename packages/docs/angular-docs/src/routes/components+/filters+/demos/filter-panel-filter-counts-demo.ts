import {Component, computed, signal} from "@angular/core"

import {FilterPanelModule} from "@qualcomm-ui/angular/filter-panel"
import {FiltersModule} from "@qualcomm-ui/angular/filters"
import {getFacetFilterSetProps} from "@qualcomm-ui/core/filter-set"
import {
  defineFilters,
  type FilterValues,
  listFilter,
  textFilter,
} from "@qualcomm-ui/core/filters"
import {ListCollection} from "@qualcomm-ui/utils/collection"
import {FacetIndex} from "@qualcomm-ui/utils/facet-index"

const builds = [
  {architecture: "arm64", id: "1", name: "android-arm64", status: "Failed"},
  {architecture: "x86-64", id: "2", name: "android-x86", status: "Passed"},
  {architecture: "arm64", id: "3", name: "ios-simulator", status: "Queued"},
  {architecture: "x86-64", id: "4", name: "linux-gcc", status: "Passed"},
  {architecture: "x86-64", id: "5", name: "linux-clang", status: "Failed"},
  {architecture: "x86-64", id: "6", name: "windows-msvc", status: "Passed"},
  {architecture: "arm64", id: "7", name: "windows-arm64", status: "Queued"},
  {architecture: "arm64", id: "8", name: "macos-arm64", status: "Passed"},
]

const filters = defineFilters({
  architecture: listFilter({
    collection: new ListCollection({items: ["arm64", "x86-64"]}),
    label: "Architecture",
  }),
  name: textFilter({label: "Name"}),
  status: listFilter({
    collection: new ListCollection({items: ["Failed", "Passed", "Queued"]}),
    label: "Status",
  }),
})

type BuildFilters = FilterValues<typeof filters>

const facetIndex = new FacetIndex(builds, {
  fields: {architecture: {}, status: {}},
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

@Component({
  imports: [FilterPanelModule, FiltersModule],
  selector: "filter-panel-filter-counts-demo",
  template: `
    <div class="flex w-full max-w-3xl flex-wrap items-start gap-6">
      <!-- preview -->
      <div
        class="w-72"
        q-filter-panel-root
        [filters]="filters"
        [getFilterCollection]="facetProps.getFilterCollection"
        [getFilterOptionCounts]="facetProps.getFilterOptionCounts"
        [value]="value()"
        (valueChanged)="value.set($event)"
      >
        <div q-filter-panel-filter [filter]="filters.name">
          <q-text-input-filter />
        </div>
        <div q-filter-panel-filter [filter]="filters.status">
          <q-checkbox-group-filter />
        </div>
        <div q-filter-panel-filter [filter]="filters.architecture">
          <q-radio-group-filter />
        </div>
      </div>
      <ul class="text-neutral-primary font-body-md min-w-60 flex-1">
        @for (build of results(); track build.id) {
          <li>{{ build.name }}</li>
        }
      </ul>
      <!-- preview -->
    </div>
  `,
})
export class FilterPanelFilterCountsDemo {
  readonly facetProps = facetProps
  readonly filters = filters
  readonly value = signal<BuildFilters>({})

  readonly results = computed(() => {
    const value = this.value()
    const {ids} = facetIndex.filter({
      ids: matchName(value),
      selections: {
        architecture: value.architecture ?? [],
        status: value.status ?? [],
      },
    })
    return builds.filter((build) => ids.includes(build.id))
  })
}
