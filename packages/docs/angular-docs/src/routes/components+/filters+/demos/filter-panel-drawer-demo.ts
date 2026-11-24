import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {DrawerModule} from "@qualcomm-ui/angular/drawer"
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
  imports: [
    ButtonModule,
    DrawerModule,
    FilterPanelModule,
    FiltersModule,
    TagDirective,
  ],
  selector: "filter-panel-drawer-demo",
  template: `
    <div class="flex w-full max-w-3xl flex-wrap items-center gap-4">
      <!-- preview -->
      <div q-drawer-root unmountOnExit (openChanged)="onOpenChange($event)">
        <button q-button q-drawer-trigger variant="outline">
          Filters ({{ filterSet().valueCount }})
        </button>
        <q-drawer-floating-portal>
          <div q-drawer-body>
            <h2 q-drawer-heading>Filters</h2>
            <button q-drawer-close-button></button>
            <div q-filter-panel-root-provider [value]="filterSet()">
              <div q-filter-panel-filter [filter]="filterSet().filters.status">
                <q-checkbox-group-filter />
              </div>
              <div q-filter-panel-filter [filter]="filterSet().filters.owner">
                <q-combobox-filter />
              </div>
            </div>
          </div>
        </q-drawer-floating-portal>
      </div>
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
      <!-- preview -->
    </div>
  `,
})
export class FilterPanelDrawerDemo {
  readonly filterSet = useFilterSet({applyMode: "manual", filters})

  onOpenChange(open: boolean) {
    if (!open) {
      // apply draft values when the drawer closes
      this.filterSet().apply()
    }
  }
}
