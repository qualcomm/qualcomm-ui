import {Component} from "@angular/core"

import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"
import {useListCollection} from "@qualcomm-ui/angular-core/collection"
import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"

import {countries} from "./country-list"

@Component({
  imports: [ComboboxModule, ProgressRingModule],
  selector: "combobox-simple-demo",
  template: `
    <!-- preview -->
    <div class="flex flex-col gap-4">
      <q-combobox
        class="w-56"
        label="Country"
        placeholder="Select a country"
        [collection]="listCollection.collection()"
        (inputValueChanged)="onInputChange($event)"
      />
    </div>
    <!-- preview -->
  `,
})
export class ComboboxSimpleDemo {
  readonly listCollection = useListCollection<string>({
    filter: "contains",
    items: countries,
  })

  onInputChange(event: ComboboxInputValueChangeDetails) {
    this.listCollection.filterText.set(event.inputValue)
  }
}
