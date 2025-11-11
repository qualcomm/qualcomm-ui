import {Component} from "@angular/core"

import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {useListCollection} from "@qualcomm-ui/angular-core/collection"
import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"

const cityList = ["San Diego", "Dallas", "Denver"]

@Component({
  imports: [ComboboxModule],
  selector: "combobox-sizes-demo",
  template: `
    <div class="flex flex-col items-center gap-4">
      <q-combobox
        ariaLabel="City"
        class="w-40"
        placeholder="sm"
        size="sm"
        [collection]="listCollection.collection()"
        (inputValueChanged)="onInputChange($event)"
      />
      <q-combobox
        ariaLabel="City"
        class="w-48"
        placeholder="md"
        size="md"
        [collection]="listCollection.collection()"
        (inputValueChanged)="onInputChange($event)"
      />
      <q-combobox
        ariaLabel="City"
        class="w-56"
        placeholder="lg"
        size="lg"
        [collection]="listCollection.collection()"
        (inputValueChanged)="onInputChange($event)"
      />
    </div>
  `,
})
export class ComboboxSizesDemo {
  readonly listCollection = useListCollection<string>({
    filter: "contains",
    items: cityList,
  })

  onInputChange(event: ComboboxInputValueChangeDetails) {
    this.listCollection.filterText.set(event.inputValue)
  }
}
