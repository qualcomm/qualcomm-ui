import {Component} from "@angular/core"

import {SelectModule} from "@qualcomm-ui/angular/select"
import {selectCollection} from "@qualcomm-ui/core/select"

@Component({
  imports: [SelectModule],
  selector: "select-multiple-demo",
  template: `
    <!-- preview -->
    <q-select
      class="w-72"
      label="City"
      multiple
      placeholder="Select a city"
      [collection]="cityCollection"
    />
    <!-- preview -->
  `,
})
export class SelectMultipleDemo {
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
