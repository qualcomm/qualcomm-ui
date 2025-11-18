import {Component, computed, input} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {NumberInputModule} from "@qualcomm-ui/angular/number-input"
import type {Column} from "@qualcomm-ui/core/table"

import type {User} from "./data"

@Component({
  imports: [NumberInputModule, FormsModule],
  selector: "app-min-max-number-filter",
  template: `
    <div class="flex w-32 gap-2">
      <q-number-input
        placeholder="Min"
        size="sm"
        [min]="0"
        [ngModel]="filterValue()[0]"
        (ngModelChange)="onMinValueChange($event)"
      >
        <div hidden q-number-input-control></div>
      </q-number-input>
    </div>
  `,
})
export class MinMaxNumberFilter {
  readonly column = input.required<Column<User>>()

  readonly filterValue = computed(
    () => this.column().getFilterValue() as [number, number],
  )

  onMinValueChange(value: number) {
    this.column().setFilterValue((prev: [number, number]) => [value, prev?.[1]])
  }
}
