import {Component} from "@angular/core"

import {FilterPanelModule} from "@qualcomm-ui/angular/filter-panel"
import {FiltersModule, useFilterSet} from "@qualcomm-ui/angular/filters"
import {TagDirective} from "@qualcomm-ui/angular/tag"
import {defineFilters, listFilter} from "@qualcomm-ui/core/filters"
import {ListCollection} from "@qualcomm-ui/utils/collection"

const owners = [
  {label: "Anna Robinson", value: "u1"},
  {label: "Ben Ortiz", value: "u2"},
  {label: "Chloe Nguyen", value: "u3"},
  {label: "Dev Patel", value: "u4"},
]

const filters = defineFilters({
  owner: listFilter({
    collection: new ListCollection({items: owners}),
    label: "Owner",
  }),
  status: listFilter({
    collection: new ListCollection({items: ["Failed", "Passed", "Queued"]}),
    label: "Status",
  }),
})

@Component({
  imports: [FilterPanelModule, FiltersModule, TagDirective],
  selector: "filter-panel-hoisted-state-demo",
  template: `
    <!-- preview -->
    <div class="flex w-full max-w-3xl flex-wrap items-start gap-6">
      <div class="w-72" q-filter-panel-root-provider [value]="filterSet()">
        <div q-filter-panel-filter [filter]="filters.status">
          <q-checkbox-group-filter />
        </div>
        <div q-filter-panel-filter [filter]="filters.owner">
          <q-combobox-filter />
        </div>
      </div>
      <div class="flex min-w-60 flex-1 flex-wrap gap-2">
        @for (
          item of filterSet().getValueItems();
          track item.filterId + ":" + item.value
        ) {
          <span
            q-tag
            variant="dismissable"
            (dismiss)="filterSet().removeFilterValue(item.filterId, item.value)"
          >
            {{ item.label }}
          </span>
        }
      </div>
    </div>
    <!-- preview -->
  `,
})
export class FilterPanelHoistedStateDemo {
  readonly filters = filters
  readonly filterSet = useFilterSet({filters})
}
