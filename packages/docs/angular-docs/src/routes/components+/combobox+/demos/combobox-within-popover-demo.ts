import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {PopoverModule} from "@qualcomm-ui/angular/popover"
import {useListCollection} from "@qualcomm-ui/angular-core/collection"
import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"

import {countries} from "./country-list"

@Component({
  imports: [ComboboxModule, PopoverModule, ButtonModule],
  selector: "combobox-within-popover-demo",
  template: `
    <!-- preview -->
    <div q-popover>
      <div q-popover-anchor>
        <button q-button q-popover-trigger variant="outline">Click Me</button>
      </div>
      <q-combobox
        disablePortal
        label="Country"
        placeholder="Search for a country"
        [collection]="listCollection.collection()"
        (inputValueChanged)="onInputChange($event)"
      />
    </div>
    <!-- preview -->
  `,
})
export class ComboboxWithinPopoverDemo {
  readonly listCollection = useListCollection<string>({
    filter: "contains",
    items: countries,
  })

  onInputChange(event: ComboboxInputValueChangeDetails) {
    this.listCollection.filterText.set(event.inputValue)
  }
}
