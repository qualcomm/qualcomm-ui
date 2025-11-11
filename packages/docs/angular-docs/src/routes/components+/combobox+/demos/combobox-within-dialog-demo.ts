import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {DialogModule} from "@qualcomm-ui/angular/dialog"
import {useListCollection} from "@qualcomm-ui/angular-core/collection"
import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"

import {countries} from "./country-list"

@Component({
  imports: [ComboboxModule, ButtonModule, DialogModule],
  selector: "combobox-within-dialog-demo",
  template: `
    <div q-dialog-root>
      <button emphasis="primary" q-button q-dialog-trigger variant="fill">
        Open Dialog
      </button>
      <q-dialog-floating-portal>
        <div q-dialog-body>
          <div q-dialog-heading>Dialog Title</div>
          <button q-dialog-close-button></button>
          <!-- preview -->
          <q-combobox
            ariaLabel="Country"
            class="w-48"
            disablePortal
            placeholder="Select a country"
            [collection]="listCollection.collection()"
            (inputValueChanged)="onInputChange($event)"
          />
          <!-- preview -->
        </div>

        <div q-dialog-footer>
          <button
            emphasis="primary"
            q-button
            q-dialog-close-trigger
            size="sm"
            variant="fill"
          >
            Confirm
          </button>
        </div>
      </q-dialog-floating-portal>
    </div>
  `,
})
export class ComboboxWithinDialogDemo {
  readonly listCollection = useListCollection<string>({
    filter: "contains",
    items: countries,
  })

  onInputChange(event: ComboboxInputValueChangeDetails) {
    this.listCollection.filterText.set(event.inputValue)
  }
}
