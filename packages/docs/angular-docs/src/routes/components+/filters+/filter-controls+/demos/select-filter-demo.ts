import {Component, signal} from "@angular/core"

import {FilterPanelModule} from "@qualcomm-ui/angular/filter-panel"
import {FiltersModule} from "@qualcomm-ui/angular/filters"
import {JsonViewerModule} from "@qualcomm-ui/angular/json-viewer"
import {
  defineFilters,
  type FilterValues,
  listFilter,
} from "@qualcomm-ui/core/filters"
import {ListCollection} from "@qualcomm-ui/utils/collection"

const filters = defineFilters({
  standard: listFilter({
    collection: new ListCollection({
      items: [
        {label: "Wi-Fi 6", value: "wifi6"},
        {label: "Wi-Fi 6E", value: "wifi6e"},
        {label: "Wi-Fi 7", value: "wifi7"},
      ],
    }),
    label: "Standard",
  }),
})

@Component({
  imports: [FilterPanelModule, FiltersModule, JsonViewerModule],
  selector: "select-filter-demo",
  template: `
    <div class="flex w-full max-w-3xl flex-wrap items-start gap-6">
      <!-- preview -->
      <div
        class="w-72"
        q-filter-panel-root
        [filters]="filters"
        (valueChanged)="value.set($event)"
      >
        <div q-filter-panel-filter [filter]="filters.standard">
          <q-select-filter />
        </div>
      </div>
      <!-- preview -->
      <div class="min-w-60 flex-1" q-json-viewer [data]="value()"></div>
    </div>
  `,
})
export class SelectFilterDemo {
  readonly filters = filters
  readonly value = signal<FilterValues<typeof filters>>({})
}
