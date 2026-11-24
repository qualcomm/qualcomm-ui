import {Component} from "@angular/core"

import {FilterPanelModule} from "@qualcomm-ui/angular/filter-panel"
import {FiltersModule} from "@qualcomm-ui/angular/filters"
import {defineFilters, listFilter} from "@qualcomm-ui/core/filters"
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
  imports: [FilterPanelModule, FiltersModule],
  selector: "filter-panel-labels-demo",
  template: `
    <!-- preview -->
    <div class="w-72" q-filter-panel-root [filters]="filters">
      <div q-filter-panel-filter [filter]="filters.status">
        <span *filterContext="let filter" q-filter-panel-filter-label>
          {{ filter.label }}
          <span class="font-body-xs text-neutral-secondary">(last run)</span>
        </span>
        <q-checkbox-group-filter />
      </div>
      <div
        label="CPU architecture"
        q-filter-panel-filter
        [filter]="filters.architecture"
      >
        <q-radio-group-filter />
      </div>
    </div>
    <!-- preview -->
  `,
})
export class FilterPanelLabelsDemo {
  readonly filters = filters
}
