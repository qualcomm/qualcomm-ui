import {Component, inject} from "@angular/core"
import {injectQuery, QueryClient} from "@tanstack/angular-query-experimental"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {FilterPanelModule} from "@qualcomm-ui/angular/filter-panel"
import {FiltersModule, useFilterSet} from "@qualcomm-ui/angular/filters"
import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"
import {TagDirective} from "@qualcomm-ui/angular/tag"
import {defineFilters, listFilter} from "@qualcomm-ui/core/filters"
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

@Component({
  imports: [
    ButtonModule,
    FilterPanelModule,
    FiltersModule,
    ProgressRingModule,
    TagDirective,
  ],
  selector: "filter-panel-restoring-selection-demo",
  template: `
    <div class="flex w-full max-w-3xl flex-col gap-4">
      <div class="flex flex-wrap items-start gap-6">
        <!-- preview -->
        <div class="w-72" q-filter-panel-root-provider [value]="filterSet()">
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
            <q-checkbox-group-filter />
          </div>
        </div>
        <div class="flex min-w-60 flex-1 flex-wrap gap-2">
          @if (owners.isPending()) {
            <div
              aria-label="Loading selected owners"
              q-progress-ring
              size="xs"
            ></div>
          } @else {
            @for (
              item of filterSet().getValueItems("owner");
              track item.value
            ) {
              <span
                q-tag
                variant="dismissable"
                (dismiss)="filterSet().removeFilterValue('owner', item.value)"
              >
                {{ item.label }}
              </span>
            }
          }
        </div>
        <!-- preview -->
      </div>
      <button class="self-start" q-button variant="outline" (click)="reload()">
        Reload
      </button>
    </div>
  `,
})
export class FilterPanelRestoringSelectionDemo {
  readonly filters = filters

  private readonly queryClient = inject(QueryClient)

  readonly owners = injectQuery(() => ({
    queryFn: fetchOwners,
    queryKey: ["owners"],
    select: toCollection,
  }))

  readonly filterSet = useFilterSet({
    defaultValue: restoredValue,
    filters,
    getFilterCollection: (id) =>
      id === "owner" ? this.owners.data() : undefined,
  })

  reload() {
    this.filterSet().setFilterValue("owner", restoredValue.owner)
    void this.queryClient.resetQueries({queryKey: ["owners"]})
  }
}
