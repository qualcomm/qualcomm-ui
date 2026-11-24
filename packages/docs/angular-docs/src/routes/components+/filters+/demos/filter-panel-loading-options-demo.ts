import {Component, inject} from "@angular/core"
import {injectQuery, QueryClient} from "@tanstack/angular-query-experimental"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {FilterPanelModule} from "@qualcomm-ui/angular/filter-panel"
import {FiltersModule} from "@qualcomm-ui/angular/filters"
import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"
import {
  defineFilters,
  type FilterId,
  listFilter,
} from "@qualcomm-ui/core/filters"
import {ListCollection} from "@qualcomm-ui/utils/collection"

import {fetchOwners, type Owner} from "./mock-api"

const filters = defineFilters({
  owner: listFilter({label: "Owner"}),
})

/**
 * Defined outside the component so the query keeps the same collection until
 * the data changes.
 */
function toCollection(owners: Owner[]): ListCollection<Owner> {
  return new ListCollection({items: owners})
}

@Component({
  imports: [ButtonModule, FilterPanelModule, FiltersModule, ProgressRingModule],
  selector: "filter-panel-loading-options-demo",
  template: `
    <div class="flex flex-col gap-4">
      <!-- preview -->
      <div
        class="w-72"
        q-filter-panel-root
        [filters]="filters"
        [getFilterCollection]="getFilterCollection"
      >
        <div q-filter-panel-filter [filter]="filters.owner">
          <span *filterContext="let filter" q-filter-panel-filter-label>
            <span class="inline-flex items-center gap-2">
              {{ filter.label }}
              @if (owners.isPending()) {
                <div
                  aria-label="Loading owners"
                  q-progress-ring
                  size="xs"
                ></div>
              }
            </span>
          </span>
          @if (owners.isError()) {
            <div class="flex items-center gap-2">
              <span class="font-body-xs text-neutral-secondary">
                Could not load owners
              </span>
              <button q-button size="sm" variant="ghost" (click)="retry()">
                Retry
              </button>
            </div>
          } @else {
            <q-checkbox-group-filter />
          }
        </div>
      </div>
      <!-- preview -->
      <button class="self-start" q-button variant="outline" (click)="reset()">
        Reset
      </button>
    </div>
  `,
})
export class FilterPanelLoadingOptionsDemo {
  readonly filters = filters

  private readonly queryClient = inject(QueryClient)

  readonly owners = injectQuery(() => ({
    queryFn: fetchOwners,
    queryKey: ["owners"],
    select: toCollection,
  }))

  readonly getFilterCollection = (id: FilterId<typeof filters>) =>
    id === "owner" ? this.owners.data() : undefined

  retry() {
    void this.owners.refetch()
  }

  reset() {
    void this.queryClient.resetQueries({queryKey: ["owners"]})
  }
}
