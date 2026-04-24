import {Component} from "@angular/core"

import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {useListCollection} from "@qualcomm-ui/angular-core/collection"
import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"

interface City {
  name: string
  value: string
}

@Component({
  imports: [ComboboxModule],
  selector: "combobox-items-demo",
  template: `
    <!-- preview -->
    <q-combobox
      class="w-48"
      label="City"
      placeholder="Select a city"
      [collection]="cityCollection.collection()"
      (inputValueChanged)="onInputChange($event)"
    />
    <!-- preview -->
  `,
})
export class ComboboxItemsDemo {
  readonly cityCollection = useListCollection<City>({
    filter: "contains",
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

  onInputChange(event: ComboboxInputValueChangeDetails) {
    this.cityCollection.filterText.set(event.inputValue)
  }
}
