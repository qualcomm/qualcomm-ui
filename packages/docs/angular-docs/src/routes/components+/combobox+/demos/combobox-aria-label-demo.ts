import {Component} from "@angular/core"

import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {useListCollection} from "@qualcomm-ui/angular-core/collection"
import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"

import {countries} from "./country-list"

@Component({
  imports: [ComboboxModule],
  selector: "combobox-aria-label-demo",
  template: `
    <!-- preview -->
    <q-combobox
      ariaLabel="Country"
      class="w-48"
      placeholder="Select a country"
      [collection]="listCollection.collection()"
      (inputValueChanged)="onInputChange($event)"
    />
    <!-- preview -->
  `,
})
export class ComboboxAriaLabelDemo {
  readonly listCollection = useListCollection<string>({
    filter: "contains",
    items: countries,
  })

  onInputChange(event: ComboboxInputValueChangeDetails) {
    this.listCollection.filterText.set(event.inputValue)
  }
}
