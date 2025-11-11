import {Component} from "@angular/core"

import {SelectModule} from "@qualcomm-ui/angular/select"
import {selectCollection} from "@qualcomm-ui/core/select"

@Component({
  imports: [SelectModule],
  selector: "select-items-demo",
  template: `
    <q-select
      class="w-48"
      label="City"
      placeholder="Select a city"
      [collection]="cityCollection"
    />
  `,
})
export class SelectItemsDemo {
  // preview
  cityCollection = selectCollection({
    itemLabel: (item) => item.name,
    items: [
      {name: "San Diego", value: "SD"},
      {name: "Nashville", value: "NV"},
      {name: "Denver", value: "DV"},
      {name: "Miami", value: "MI"},
      {name: "Las Vegas", value: "LV"},
      {name: "New York City", value: "NYC"},
      {name: "San Francisco", value: "SF"},
    ],
    itemValue: (item) => item.value,
  })
  // preview
}
