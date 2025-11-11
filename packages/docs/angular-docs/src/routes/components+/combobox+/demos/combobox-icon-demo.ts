import {Component} from "@angular/core"
import {MapPin} from "lucide-angular"

import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {useListCollection} from "@qualcomm-ui/angular-core/collection"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"

import {countries} from "./country-list"

@Component({
  imports: [ComboboxModule],
  providers: [provideIcons({MapPin})],
  selector: "combobox-icon-demo",
  template: `
    <!-- preview -->
    <q-combobox
      ariaLabel="Country"
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
