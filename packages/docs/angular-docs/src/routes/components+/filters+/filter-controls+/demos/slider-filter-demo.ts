import {Component, signal} from "@angular/core"

import {FilterPanelModule} from "@qualcomm-ui/angular/filter-panel"
import {FiltersModule} from "@qualcomm-ui/angular/filters"
import {JsonViewerModule} from "@qualcomm-ui/angular/json-viewer"
import {
  defineFilters,
  type FilterValues,
  rangeFilter,
} from "@qualcomm-ui/core/filters"

const filters = defineFilters({
  duration: rangeFilter({
    formatValue: (value) => `${value} min`,
    label: "Duration",
    max: 120,
    min: 0,
  }),
})

@Component({
  imports: [FilterPanelModule, FiltersModule, JsonViewerModule],
  selector: "slider-filter-demo",
  template: `
    <div class="flex w-full max-w-3xl flex-wrap items-start gap-6">
      <!-- preview -->
      <div
        class="w-72"
        q-filter-panel-root
        [filters]="filters"
        (valueChanged)="value.set($event)"
      >
        <div q-filter-panel-filter [filter]="filters.duration">
          <q-slider-filter />
        </div>
      </div>
      <!-- preview -->
      <div class="min-w-60 flex-1" q-json-viewer [data]="value()"></div>
    </div>
  `,
})
export class SliderFilterDemo {
  readonly filters = filters
  readonly value = signal<FilterValues<typeof filters>>({})
}
