import {Component} from "@angular/core"

import {SelectModule} from "@qualcomm-ui/angular/select"
import {selectCollection} from "@qualcomm-ui/core/select"

@Component({
  imports: [SelectModule],
  selector: "select-simple-demo",
  template: `
    <!-- preview -->
    <q-select
      class="w-48"
      label="City"
      placeholder="Select a city"
      [collection]="cityCollection"
    />
    <!-- preview -->
  `,
})
export class SelectSimpleDemo {
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
