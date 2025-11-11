import {Component, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {useListCollection} from "@qualcomm-ui/angular-core/collection"
import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"

import {countries} from "./country-list"

@Component({
  imports: [ComboboxModule, FormsModule],
  selector: "combobox-controlled-state-demo",
  template: `
    <!-- preview -->
    <q-combobox
      ariaLabel="Country"
      class="w-48"
      placeholder="Select a country"
      [collection]="listCollection.collection()"
      [(ngModel)]="value"
      (inputValueChanged)="onInputChange($event)"
    />
    <!-- preview -->
  `,
})
export class ComboboxControlledStateDemo {
  readonly value = signal<string[]>([countries[0]])

  readonly listCollection = useListCollection<string>({
    filter: "contains",
    items: countries,
  })

  onInputChange(event: ComboboxInputValueChangeDetails) {
    this.listCollection.filterText.set(event.inputValue)
  }
}
