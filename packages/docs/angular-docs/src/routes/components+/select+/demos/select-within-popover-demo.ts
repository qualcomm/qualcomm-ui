import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {PopoverModule} from "@qualcomm-ui/angular/popover"
import {SelectModule} from "@qualcomm-ui/angular/select"
import {selectCollection} from "@qualcomm-ui/core/select"

@Component({
  imports: [SelectModule, PopoverModule, ButtonModule],
  selector: "select-within-popover-demo",
  template: `
    <!-- preview -->
    <div q-popover>
      <div q-popover-anchor>
        <button q-button q-popover-trigger variant="outline">Click Me</button>
      </div>
      <q-select
        disablePortal
        label="City"
        placeholder="Select a city"
        [collection]="cityCollection"
      />
    </div>
    <!-- preview -->
  `,
})
export class SelectWithinPopoverDemo {
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
