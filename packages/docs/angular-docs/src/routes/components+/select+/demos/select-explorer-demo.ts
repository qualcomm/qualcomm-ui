import {Component} from "@angular/core"

import {SelectModule} from "@qualcomm-ui/angular/select"
import {selectCollection} from "@qualcomm-ui/core/select"

@Component({
  imports: [SelectModule],
  selector: "select-explorer-demo",
  template: `
    <q-select
      class="w-48"
      clearable
      defaultOpen
      disablePortal
      hint="Choose a location"
      label="City"
      placeholder="Select a city"
      [collection]="cityCollection"
    />
  `,
})
export class SelectExplorerDemo {
  cityCollection = selectCollection({
    items: ["San Diego", "Nashville", "Denver"],
  })
}
