import {Component} from "@angular/core"

import {SelectModule} from "@qualcomm-ui/angular/select"
import {selectCollection} from "@qualcomm-ui/core/select"

@Component({
  imports: [SelectModule],
  selector: "select-sizes-demo",
  template: `
    <div class="flex flex-col items-center gap-4">
      <!-- preview -->
      <q-select
        aria-label="City"
        class="w-40"
        placeholder="sm"
        size="sm"
        [collection]="cityCollection"
      />
      <q-select
        aria-label="City"
        class="w-48"
        placeholder="md"
        size="md"
        [collection]="cityCollection"
      />
      <q-select
        aria-label="City"
        class="w-56"
        placeholder="lg"
        size="lg"
        [collection]="cityCollection"
      />
      <!-- preview -->
    </div>
  `,
})
export class SelectSizesDemo {
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
