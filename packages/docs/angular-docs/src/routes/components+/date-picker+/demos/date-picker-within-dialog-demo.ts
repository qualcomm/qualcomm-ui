import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {DatePickerModule} from "@qualcomm-ui/angular/date-picker"
import {DialogModule} from "@qualcomm-ui/angular/dialog"

@Component({
  imports: [DatePickerModule, ButtonModule, DialogModule],
  selector: "date-picker-within-dialog-demo",
  template: `
    <div q-dialog-root>
      <button emphasis="primary" q-button q-dialog-trigger variant="fill">
        Open Dialog
      </button>
      <q-dialog-floating-portal>
        <div q-dialog-body>
          <div q-dialog-heading>Book a Flight</div>
          <button q-dialog-close-button></button>
          <!-- preview -->
          <q-date-picker class="w-64" disablePortal label="Departure date" />
          <!-- preview -->
        </div>

        <div q-dialog-footer>
          <button
            emphasis="primary"
            q-button
            q-dialog-close-trigger
            size="sm"
            variant="fill"
          >
            Confirm
          </button>
        </div>
      </q-dialog-floating-portal>
    </div>
  `,
})
export class DatePickerWithinDialogDemo {}
