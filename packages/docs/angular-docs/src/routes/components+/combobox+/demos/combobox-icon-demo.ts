import {Component} from "@angular/core"
import {LucideMapPin} from "@lucide/angular"

import {useListCollection} from "@qualcomm-ui/angular-core/collection"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"

import {countries} from "./country-list"

@Component({
  imports: [ComboboxModule],
  providers: [provideIcons({LucideMapPin})],
  selector: "combobox-icon-demo",
  template: `
    <!-- preview -->
    <q-combobox
      aria-label="Country"
      class="w-48"
      icon="MapPin"
      placeholder="Select a country"
      [collection]="listCollection.collection()"
      (inputValueChanged)="onInputChange($event)"
    />
    <!-- preview -->
  `,
})
export class ComboboxIconDemo {
  readonly listCollection = useListCollection<string>({
    filter: "contains",
    items: countries,
  })

  onInputChange(event: ComboboxInputValueChangeDetails) {
    this.listCollection.filterText.set(event.inputValue)
  }
}
