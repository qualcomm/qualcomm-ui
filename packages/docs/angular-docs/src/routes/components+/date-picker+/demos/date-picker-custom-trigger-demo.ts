import {Component} from "@angular/core"

import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {ButtonModule} from "@qualcomm-ui/angular/button"
import {DatePickerModule} from "@qualcomm-ui/angular/date-picker"

@Component({
  imports: [ButtonModule, DatePickerModule, PortalDirective],
  selector: "date-picker-custom-trigger-demo",
  template: `
    <!-- preview -->
    <div q-date-picker-root [closeOnSelect]="false">
      <div
        *datePickerContext="let api"
        class="flex gap-2"
        q-date-picker-control
      >
        <button q-button q-date-picker-trigger variant="outline">
          {{ api.valueAsString[0] || "Pick a date" }}
        </button>
        @if (api.value.length) {
          <button
            q-button
            type="button"
            variant="ghost"
            (click)="api.clearValue()"
          >
            Clear
          </button>
        }
      </div>

      <ng-template qPortal>
        <div q-date-picker-positioner>
          <div q-date-picker-content>
            <div q-date-picker-headline>
              <span q-date-picker-headline-label></span>
              <span q-date-picker-headline-value></span>
            </div>

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

            <div q-date-picker-actions>
              <button q-date-picker-cancel-trigger></button>
              <button q-date-picker-ok-trigger></button>
            </div>
          </div>
        </div>
      </ng-template>
    </div>
    <!-- preview -->
  `,
})
export class DatePickerCustomTriggerDemo {}
