import {Component} from "@angular/core"

import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {useListCollection} from "@qualcomm-ui/angular-core/collection"
import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"

import {countries} from "./country-list"

@Component({
  imports: [ComboboxModule, PortalDirective],
  selector: "combobox-composite-demo",
  template: `
    <div
      class="w-56"
      placeholder="Select a country"
      q-combobox-root
      [collection]="listCollection.collection()"
      (inputValueChanged)="onInputChange($event)"
    >
      <label q-combobox-label>Search</label>
      <div q-combobox-control>
        <input q-combobox-input />
        <button q-combobox-clear-trigger></button>
        <div q-combobox-trigger></div>
      </div>

      <ng-template qPortal>
        <div q-combobox-positioner>
          <div q-combobox-content>
            <div q-combobox-empty>No results found</div>
            <q-combobox-items />
          </div>
        </div>
      </ng-template>
    </div>
  `,
})
export class ComboboxCompositeDemo {
  readonly listCollection = useListCollection<string>({
    filter: "contains",
    items: countries,
  })

  onInputChange(event: ComboboxInputValueChangeDetails) {
    this.listCollection.filterText.set(event.inputValue)
  }
}
