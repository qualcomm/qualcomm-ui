import {Component, computed, input, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {NumberInputModule} from "@qualcomm-ui/angular/number-input"
import {TextInputModule} from "@qualcomm-ui/angular/text-input"
import type {Column, TableInstance} from "@qualcomm-ui/core/table"

import type {User} from "./data"

@Component({
  imports: [FormsModule, NumberInputModule, TextInputModule],
  selector: "app-column-filter",
  template: `
    @if (isNumberFilter()) {
      <div class="flex gap-2">
        <q-number-input
          aria-label="Min"
          class="w-24"
          placeholder="Min"
          size="sm"
          [min]="0"
          [ngModel]="rangeValue()[0]"
          (ngModelChange)="onRangeChange(0, $event)"
        >
          <div hidden q-number-input-control></div>
        </q-number-input>
        <q-number-input
          aria-label="Max"
          class="w-24"
          placeholder="Max"
          size="sm"
          [min]="0"
          [ngModel]="rangeValue()[1]"
          (ngModelChange)="onRangeChange(1, $event)"
        >
          <div hidden q-number-input-control></div>
        </q-number-input>
      </div>
    } @else {
      <q-text-input
        aria-label="Search"
        class="w-36"
        placeholder="Search..."
        size="sm"
        [ngModel]="textValue()"
        (ngModelChange)="onTextChange($event)"
      />
    }
  `,
})
export class ColumnFilter {
  readonly column = input.required<Column<User>>()
  readonly table = input.required<TableInstance<User>>()

  protected readonly isNumberFilter = computed(
    () =>
      typeof this.table()
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(this.column().id) === "number",
  )

  protected readonly textValue = signal<string>("")
  protected readonly rangeValue = signal<[number?, number?]>([])

  protected onTextChange(value: string) {
    this.textValue.set(value)
    this.column().setFilterValue(value)
  }

  protected onRangeChange(index: 0 | 1, value: number) {
    const next: [number?, number?] = [...this.rangeValue()]
    next[index] = value
    this.rangeValue.set(next)
    this.column().setFilterValue(next)
  }
}
