import {Component, inject, signal} from "@angular/core"
import {
  injectQuery,
  keepPreviousData,
  QueryClient,
} from "@tanstack/angular-query-experimental"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {FilterPanelModule} from "@qualcomm-ui/angular/filter-panel"
import {FiltersModule} from "@qualcomm-ui/angular/filters"
import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"
import {
  type FacetFilterSetProps,
  getFacetFilterSetProps,
} from "@qualcomm-ui/core/filter-set"
import {
  defineFilters,
  type FilterValues,
  listFilter,
} from "@qualcomm-ui/core/filters"
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

@Component({
  imports: [ButtonModule, FilterPanelModule, FiltersModule, ProgressRingModule],
  selector: "filter-panel-dynamic-filter-counts-demo",
  template: `
    <div class="flex w-full max-w-3xl flex-col gap-4">
      <div class="flex flex-wrap items-start gap-6">
        <!-- preview -->
        <div
          class="w-72"
          q-filter-panel-root
          [filters]="filters"
          [getFilterCollection]="facets.data()?.getFilterCollection"
          [getFilterOptionCounts]="facets.data()?.getFilterOptionCounts"
          [value]="value()"
          (valueChanged)="value.set($event)"
        >
          <div q-filter-panel-filter [filter]="filters.status">
            <span *filterContext="let filter" q-filter-panel-filter-label>
              <span class="inline-flex items-center gap-2">
                {{ filter.label }}
                @if (facets.isPending()) {
                  <div
                    aria-label="Loading statuses"
                    q-progress-ring
                    size="xs"
                  ></div>
                }
              </span>
            </span>
            <q-checkbox-group-filter />
          </div>
          <div q-filter-panel-filter [filter]="filters.platform">
            <span *filterContext="let filter" q-filter-panel-filter-label>
              <span class="inline-flex items-center gap-2">
                {{ filter.label }}
                @if (facets.isPending()) {
                  <div
                    aria-label="Loading platforms"
                    q-progress-ring
                    size="xs"
                  ></div>
                }
              </span>
            </span>
            <q-checkbox-group-filter />
          </div>
        </div>
        <!-- preview -->
        <div class="flex flex-col gap-2">
          <div
            class="text-neutral-primary font-body-md inline-flex items-center gap-2"
          >
            <span>Builds: {{ results.data()?.length }}</span>
            @if (results.isFetching()) {
              <div aria-label="Loading builds" q-progress-ring size="xs"></div>
            }
          </div>
          @if (results.data(); as builds) {
            <ul class="text-neutral-primary font-body-md min-w-60 flex-1">
              @for (build of builds; track build.id) {
                <li>{{ build.name }}</li>
              }
            </ul>
          }
        </div>
      </div>
      <button class="self-start" q-button variant="outline" (click)="reload()">
        Reload
      </button>
    </div>
  `,
})
export class FilterPanelDynamicFilterCountsDemo {
  readonly filters = filters
  readonly value = signal<BuildFilters>({})

  private readonly queryClient = inject(QueryClient)

  /**
   * The index is built from the unfiltered results, so it counts every value
   * of a field, and values don't drop out as the filters narrow the results.
   */
  readonly facets = injectQuery(() => ({
    queryFn: () => fetchBuilds({}),
    queryKey: ["builds"],
    select: indexBuilds,
  }))

  readonly results = injectQuery(() => {
    const value = this.value()
    return {
      placeholderData: keepPreviousData,
      queryFn: () => fetchBuilds(value),
      queryKey: ["builds", value],
    }
  })

  reload() {
    void this.queryClient.resetQueries({queryKey: ["builds"]})
  }
}
