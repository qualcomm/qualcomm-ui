import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {NumberInputModule} from "@qualcomm-ui/angular/number-input"
import type {Column, ColumnFiltersState} from "@qualcomm-ui/core/table"

import type {User, UserColumnMeta} from "./data"

function getFilterValue(columnFilters: ColumnFiltersState, columnId: string) {
  return columnFilters.find((f) => f.id === columnId)?.value
}

function setFilterValue(
  columnFilters: ColumnFiltersState,
  columnId: string,
  value: unknown,
): ColumnFiltersState {
  const existing = columnFilters.find((f) => f.id === columnId)

  // Remove filter if value is empty
  if (
    value === undefined ||
    value === "" ||
    (Array.isArray(value) &&
      value.every(
        (v) =>
          v === undefined || v === 0 || (typeof v === "number" && isNaN(v)),
      ))
  ) {
    return columnFilters.filter((f) => f.id !== columnId)
  }

  if (existing) {
    return columnFilters.map((f) => (f.id === columnId ? {...f, value} : f))
  }

  return [...columnFilters, {id: columnId, value}]
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NumberInputModule, FormsModule],
  selector: "app-min-max-number-filter",
  template: `
    <div class="flex flex-col gap-1">
      @if (filterLabel()) {
        <label class="font-label-sm text-neutral-secondary">
          {{ filterLabel() }}
        </label>
      }
      <div class="flex w-32 gap-2">
        <q-number-input
          aria-label="Min value"
          placeholder="Min"
          size="sm"
          [min]="0"
          [ngModel]="minValue()"
          (ngModelChange)="onMinValueChange($event)"
        >
          <div hidden q-number-input-control></div>
        </q-number-input>
        <q-number-input
          aria-label="Max value"
          placeholder="Max"
          size="sm"
          [max]="999"
          [ngModel]="maxValue()"
          (ngModelChange)="onMaxValueChange($event)"
        >
          <div hidden q-number-input-control></div>
        </q-number-input>
      </div>
    </div>
  `,
})
export class MinMaxNumberFilter {
  readonly column = input.required<Column<User, any, UserColumnMeta>>()
  readonly columnFilters = input.required<ColumnFiltersState>()
  readonly columnFiltersChange = output<ColumnFiltersState>()

  readonly filterValue = computed(() => {
    return getFilterValue(this.columnFilters(), this.column().id) as
      | [number, number]
      | undefined
  })

  readonly minValue = computed(() => this.filterValue()?.[0] ?? null)
  readonly maxValue = computed(() => this.filterValue()?.[1] ?? null)

  readonly filterLabel = computed(
    () => this.column().columnDef.meta?.filterLabel,
  )

  onMinValueChange(value: number | null) {
    this.columnFiltersChange.emit(
      setFilterValue(this.columnFilters(), this.column().id, [
        value,
        this.filterValue()?.[1],
      ]),
    )
  }

  onMaxValueChange(value: number | null) {
    this.columnFiltersChange.emit(
      setFilterValue(this.columnFilters(), this.column().id, [
        this.filterValue()?.[0],
        value,
      ]),
    )
  }
}
