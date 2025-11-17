import {Component, computed, input} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {TextInputModule} from "@qualcomm-ui/angular/text-input"
import type {Column, TableInstance} from "@qualcomm-ui/core/table"

import type {User} from "./data"
import {MinMaxNumberFilter} from "./min-max-number-filter"

@Component({
  imports: [MinMaxNumberFilter, TextInputModule, FormsModule],
  selector: "app-table-column-filter",
  template: `
    @if (isNumberFilter()) {
      <app-min-max-number-filter [column]="column()" />
    } @else {
      <q-text-input
        class="w-32"
        placeholder="Search..."
        size="sm"
        [ngModel]="column().getFilterValue()"
        (ngModelChange)="onChange($event)"
      />
    }
  `,
})
export class TableColumnFilter {
  readonly column = input.required<Column<User>>()
  readonly table = input.required<TableInstance<User>>()

  protected readonly isNumberFilter = computed(
    () =>
      typeof this.table()
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(this.column().id) === "number",
  )

  protected onChange(value: string) {
    this.column().setFilterValue(value)
  }
}
