import {Component} from "@angular/core"

import {SelectModule} from "@qualcomm-ui/angular/select"
import {selectCollection} from "@qualcomm-ui/core/select"

@Component({
  imports: [SelectModule],
  selector: "select-max-height-demo",
  template: `
    <!-- preview -->
    <q-select
      class="w-48"
      label="City"
      placeholder="Select a city"
      [collection]="cityCollection"
    >
      <div q-select-content style="max-height: 240px">
        <q-select-items />
      </div>
    </q-select>
    <!-- preview -->
  `,
})
export class SelectMaxHeightDemo {
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
