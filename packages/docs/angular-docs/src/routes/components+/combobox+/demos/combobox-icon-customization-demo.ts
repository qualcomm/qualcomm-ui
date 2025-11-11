import {Component, signal} from "@angular/core"

import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"
import {useListCollection} from "@qualcomm-ui/angular-core/collection"
import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"

import {countries} from "./country-list"

@Component({
  imports: [ComboboxModule, ProgressRingModule],
  selector: "combobox-icon-customization-demo",
  template: `
    <!-- preview -->
    <q-combobox
      ariaLabel="Country"
      class="w-48"
      placeholder="Select a country"
      [collection]="listCollection.collection()"
      (inputValueChanged)="onInputChange($event)"
    >
      @if (loading()) {
        <div q-combobox-icon q-progress-ring size="xs"></div>
      }
    </q-combobox>
    <!-- preview -->
  `,
})
export class ComboboxIconCustomizationDemo {
  readonly loading = signal(true)

  readonly listCollection = useListCollection<string>({
    filter: "contains",
    items: countries,
  })

  onInputChange(event: ComboboxInputValueChangeDetails) {
    this.listCollection.filterText.set(event.inputValue)
  }
}
