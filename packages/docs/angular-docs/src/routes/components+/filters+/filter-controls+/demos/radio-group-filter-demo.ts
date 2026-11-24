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
  architecture: listFilter({
    collection: new ListCollection({items: ["arm64", "x86-64"]}),
    label: "Architecture",
  }),
})

@Component({
  imports: [FilterPanelModule, FiltersModule, JsonViewerModule],
  selector: "radio-group-filter-demo",
  template: `
    <div class="flex w-full max-w-3xl flex-wrap items-start gap-6">
      <!-- preview -->
      <div
        class="w-72"
        q-filter-panel-root
        [filters]="filters"
        (valueChanged)="value.set($event)"
      >
        <div q-filter-panel-filter [filter]="filters.architecture">
          <q-radio-group-filter anyLabel="Any" />
        </div>
      </div>
      <!-- preview -->
      <div class="min-w-60 flex-1" q-json-viewer [data]="value()"></div>
    </div>
  `,
})
export class RadioGroupFilterDemo {
  readonly filters = filters
  readonly value = signal<FilterValues<typeof filters>>({})
}
