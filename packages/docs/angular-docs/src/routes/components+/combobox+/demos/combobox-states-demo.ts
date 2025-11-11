import {Component} from "@angular/core"

import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {useListCollection} from "@qualcomm-ui/angular-core/collection"

import {countries} from "./country-list"

@Component({
  imports: [ComboboxModule],
  selector: "combobox-states-demo",
  template: `
    <div class="flex flex-col items-start gap-4">
      <q-combobox
        class="w-48"
        disabled
        label="Disabled"
        placeholder="Select a country"
        [collection]="listCollection.collection()"
      />
      <q-combobox
        class="w-48"
        label="Read Only"
        placeholder="Select a country"
        readOnly
        [collection]="listCollection.collection()"
      />
      <q-combobox
        class="w-48"
        invalid
        label="Invalid"
        placeholder="Select a country"
        [collection]="listCollection.collection()"
      />
    </div>
  `,
})
export class ComboboxStatesDemo {
  readonly listCollection = useListCollection<string>({
    filter: "contains",
    items: countries,
  })
}
