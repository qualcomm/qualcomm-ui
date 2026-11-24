import {Component, signal} from "@angular/core"

import {FilterPanelModule} from "@qualcomm-ui/angular/filter-panel"
import {FiltersModule} from "@qualcomm-ui/angular/filters"
import {JsonViewerModule} from "@qualcomm-ui/angular/json-viewer"
import {
  dateFilter,
  defineFilters,
  type FilterValues,
} from "@qualcomm-ui/core/filters"

const filters = defineFilters({
  submitted: dateFilter({
    label: "Submitted",
    presets: [
      {label: "Last 7 days", value: "last7Days"},
      {label: "This month", value: "thisMonth"},
      {
        label: "Since release",
        range: () => ["2026-09-01", null],
        value: "sinceRelease",
      },
    ],
  }),
})

@Component({
  imports: [FilterPanelModule, FiltersModule, JsonViewerModule],
  selector: "date-filter-demo",
  template: `
    <div class="flex w-full max-w-3xl flex-wrap items-start gap-6">
      <!-- preview -->
      <div
        class="w-72"
        q-filter-panel-root
        [filters]="filters"
        (valueChanged)="value.set($event)"
      >
        <div q-filter-panel-filter [filter]="filters.submitted">
          <q-date-filter />
        </div>
      </div>
      <!-- preview -->
      <div class="min-w-60 flex-1" q-json-viewer [data]="value()"></div>
    </div>
  `,
})
export class DateFilterDemo {
  readonly filters = filters
  readonly value = signal<FilterValues<typeof filters>>({})
}
