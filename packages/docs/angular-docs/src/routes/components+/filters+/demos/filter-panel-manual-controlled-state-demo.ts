import {Component, signal} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
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
  status: listFilter({
    collection: new ListCollection({items: ["Failed", "Passed", "Queued"]}),
    label: "Status",
  }),
})

@Component({
  imports: [ButtonModule, FilterPanelModule, FiltersModule, JsonViewerModule],
  selector: "filter-panel-manual-controlled-state-demo",
  template: `
    <div class="flex w-full max-w-3xl flex-wrap items-start gap-6">
      <!-- preview -->
      <div
        applyMode="manual"
        class="w-72"
        q-filter-panel-root
        [filters]="filters"
        [value]="value()"
        (valueChanged)="value.set($event)"
      >
        <div q-filter-panel-filter [filter]="filters.status">
          <q-checkbox-group-filter />
        </div>
        <div q-filter-panel-filter [filter]="filters.architecture">
          <q-radio-group-filter />
        </div>
        <div q-filter-panel-footer>
          <button q-filter-panel-apply-button></button>
        </div>
      </div>
      <!-- preview -->
      <div class="flex min-w-60 flex-1 flex-col items-start gap-4">
        <button q-button size="sm" variant="outline" (click)="value.set({})">
          Reset value
        </button>
        <div class="w-full" q-json-viewer [data]="value()"></div>
      </div>
    </div>
  `,
})
export class FilterPanelManualControlledStateDemo {
  readonly filters = filters
  readonly value = signal<FilterValues<typeof filters>>({
    status: ["Failed"],
  })
}
