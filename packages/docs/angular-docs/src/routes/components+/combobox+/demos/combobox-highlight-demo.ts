import {Component} from "@angular/core"

import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {useListCollection} from "@qualcomm-ui/angular-core/collection"
import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"

import {countries} from "./country-list"

// TODO: highlightMatchingText prop not yet implemented in Angular
@Component({
  imports: [ComboboxModule],
  selector: "combobox-highlight-demo",
  template: `
    <!-- preview -->
    <q-combobox
      class="w-56"
      highlightMatchingText
      label="Country"
      name="combobox-highlight"
      placeholder="Search countries..."
      [collection]="listCollection.collection()"
      (inputValueChanged)="onInputChange($event)"
    />
    <!-- preview -->
  `,
})
export class ComboboxHighlightDemo {
  readonly listCollection = useListCollection<string>({
    filter: "contains",
    items: countries,
  })

  onInputChange(event: ComboboxInputValueChangeDetails) {
    this.listCollection.filterText.set(event.inputValue)
  }
}
