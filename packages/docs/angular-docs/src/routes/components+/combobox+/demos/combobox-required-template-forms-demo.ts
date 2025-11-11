import {Component, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {useListCollection} from "@qualcomm-ui/angular-core/collection"
import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"

import {countries} from "./country-list"

@Component({
  imports: [ComboboxModule, FormsModule],
  selector: "combobox-required-template-forms-demo",
  template: `
    <!-- preview -->
    <q-combobox
      class="w-48"
      errorText="Please select a country"
      label="Country"
      placeholder="Select a country"
      required
      [collection]="listCollection.collection()"
      [(ngModel)]="value"
      (inputValueChanged)="onInputChange($event)"
    />
    <!-- preview -->
  `,
})
export class ComboboxRequiredTemplateFormsDemo {
  readonly value = signal<string[]>([])

  readonly listCollection = useListCollection<string>({
    filter: "contains",
    items: countries,
  })

  onInputChange(event: ComboboxInputValueChangeDetails) {
    this.listCollection.filterText.set(event.inputValue)
  }
}
