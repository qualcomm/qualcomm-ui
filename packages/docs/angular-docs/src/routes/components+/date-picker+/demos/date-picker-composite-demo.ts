import {Component, signal} from "@angular/core"

import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {DatePickerModule} from "@qualcomm-ui/angular/date-picker"
import type {
  DatePickerValueChangeDetails,
  DateValue,
} from "@qualcomm-ui/core/date-picker"

@Component({
  imports: [DatePickerModule, PortalDirective],
  selector: "date-picker-composite-demo",
  template: `
    <!-- preview -->
    <div
      class="w-64"
      q-date-picker-root
      required
      [invalid]="!value().length"
      (valueChanged)="onValueChange($event)"
    >
      <div q-date-picker-control>
        <div label="Departure date" q-date-picker-input-group></div>
      </div>
      <div q-date-picker-hint>Choose a date in mm/dd/yyyy format</div>
      <div q-date-picker-error-text>A departure date is required</div>

      <ng-template qPortal>
        <div q-date-picker-positioner>
          <div q-date-picker-content>
            <div q-date-picker-view view="day">
              <div q-date-picker-view-control>
                <button q-date-picker-view-trigger view="month">
                  <q-date-picker-month-text />
                </button>
                <button q-date-picker-view-trigger view="year">
                  <q-date-picker-year-text />
                </button>
                <button q-date-picker-prev-trigger></button>
                <button q-date-picker-next-trigger></button>
              </div>
              <table q-date-picker-table>
                <thead q-date-picker-day-grid-header></thead>
                <tbody q-date-picker-day-grid></tbody>
              </table>
            </div>

            <div q-date-picker-view view="month">
              <div q-date-picker-view-control>
                <button disabled q-date-picker-view-trigger view="month">
                  <q-date-picker-month-text />
                </button>
                <button disabled q-date-picker-view-trigger view="year">
                  <q-date-picker-year-text />
                </button>
                <button q-date-picker-prev-trigger></button>
                <button q-date-picker-next-trigger></button>
                <button q-date-picker-view-close-trigger></button>
              </div>
              <table q-date-picker-table>
                <tbody q-date-picker-month-grid></tbody>
              </table>
            </div>

            <div q-date-picker-view view="year">
              <div q-date-picker-view-control>
                <button disabled q-date-picker-view-trigger view="month">
                  <q-date-picker-month-text />
                </button>
                <button disabled q-date-picker-view-trigger view="year">
                  <q-date-picker-year-text />
                </button>
                <button q-date-picker-prev-trigger></button>
                <button q-date-picker-next-trigger></button>
                <button q-date-picker-view-close-trigger></button>
              </div>
              <table q-date-picker-table>
                <tbody q-date-picker-year-grid></tbody>
              </table>
            </div>
          </div>
        </div>
      </ng-template>
    </div>
    <!-- preview -->
  `,
})
export class DatePickerCompositeDemo {
  readonly value = signal<(DateValue | null)[]>([])

  onValueChange(details: DatePickerValueChangeDetails) {
    this.value.set(details.value)
  }
}
