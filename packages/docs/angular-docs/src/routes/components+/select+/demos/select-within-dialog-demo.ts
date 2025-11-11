import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {DialogModule} from "@qualcomm-ui/angular/dialog"
import {SelectModule} from "@qualcomm-ui/angular/select"
import {selectCollection} from "@qualcomm-ui/core/select"

@Component({
  imports: [SelectModule, ButtonModule, DialogModule],
  selector: "select-within-dialog-demo",
  template: `
    <div q-dialog-root>
      <button emphasis="primary" q-button q-dialog-trigger variant="fill">
        Open Dialog
      </button>
      <q-dialog-floating-portal>
        <div q-dialog-body>
          <div q-dialog-heading>Dialog Title</div>
          <button q-dialog-close-button></button>
          <!-- preview -->
          <q-select
            aria-label="City"
            class="w-48"
            disablePortal
            placeholder="Select a city"
            [collection]="cityCollection"
          />
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
export class SelectWithinDialogDemo {
  cityCollection = selectCollection({
    items: [
      "San Diego",
      "Nashville",
      "Denver",
      "Miami",
      "Las Vegas",
      "New York City",
      "San Francisco",
    ],
  })
}
