import {Component, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {FilterPanelModule} from "@qualcomm-ui/angular/filter-panel"
import {useFilter} from "@qualcomm-ui/angular/filters"
import {JsonViewerModule} from "@qualcomm-ui/angular/json-viewer"
import {SwitchModule} from "@qualcomm-ui/angular/switch"
import {
  customFilter,
  defineFilters,
  type FilterValues,
} from "@qualcomm-ui/core/filters"

const filters = defineFilters({
  attachments: customFilter<boolean>({
    getValueItems: () => [{label: "Has attachments", value: "true"}],
    isEmptyValue: (value) => !value,
    label: "Attachments",
  }),
})

@Component({
  imports: [FormsModule, SwitchModule],
  selector: "attachments-filter-control",
  template: `
    @if (filter(); as filter) {
      <label
        label="Has attachments"
        q-switch
        [ngModel]="filter.value ?? false"
        (ngModelChange)="filter.setValue($event)"
      ></label>
    }
  `,
})
class AttachmentsFilterControl {
  protected readonly filter = useFilter<typeof filters.attachments>()
}

@Component({
  imports: [AttachmentsFilterControl, FilterPanelModule, JsonViewerModule],
  selector: "filter-panel-custom-filters-demo",
  template: `
    <div class="flex w-full max-w-3xl flex-wrap items-start gap-6">
      <!-- preview -->
      <div
        class="w-72"
        q-filter-panel-root
        [filters]="filters"
        (valueChanged)="value.set($event)"
      >
        <div q-filter-panel-filter [filter]="filters.attachments">
          <attachments-filter-control />
        </div>
      </div>
      <!-- preview -->
      <div class="min-w-60 flex-1" q-json-viewer [data]="value()"></div>
    </div>
  `,
})
export class FilterPanelCustomFiltersDemo {
  readonly filters = filters
  readonly value = signal<FilterValues<typeof filters>>({})
}
