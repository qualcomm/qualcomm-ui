import {Component} from "@angular/core"

import {SelectModule} from "@qualcomm-ui/angular/select"
import {selectCollection} from "@qualcomm-ui/core/select"

@Component({
  imports: [SelectModule],
  selector: "select-aria-label-demo",
  template: `
    <!-- preview -->
    <q-select
      aria-label="City"
      class="w-48"
      placeholder="Select a city"
      [collection]="cityCollection"
    />
    <!-- preview -->
  `,
})
export class SelectAriaLabelDemo {
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
