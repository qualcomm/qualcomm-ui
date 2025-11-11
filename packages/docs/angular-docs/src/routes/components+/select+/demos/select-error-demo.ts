import {Component} from "@angular/core"

import {SelectModule} from "@qualcomm-ui/angular/select"
import {selectCollection} from "@qualcomm-ui/core/select"

@Component({
  imports: [SelectModule],
  selector: "select-error-demo",
  template: `
    <!-- preview -->
    <q-select
      class="w-48"
      errorText="Invalid"
      invalid
      label="City"
      [collection]="cityCollection"
    />
    <!-- preview -->
  `,
})
export class SelectErrorDemo {
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
