import {Component} from "@angular/core"

import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {useListCollection} from "@qualcomm-ui/angular-core/collection"
import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"

import {countries} from "./country-list"

@Component({
  imports: [ComboboxModule],
  selector: "combobox-template-form-state-demo",
  template: `
    <div class="flex w-60 flex-col gap-4">
      <!-- preview -->
      <q-combobox
        disabled
        label="Disabled"
        placeholder="Disabled"
        [collection]="listCollection.collection()"
        (inputValueChanged)="onInputChange($event)"
      />
      <q-combobox
        label="Read only"
        placeholder="Read only"
        readOnly
        [collection]="listCollection.collection()"
        (inputValueChanged)="onInputChange($event)"
      />
      <q-combobox
        errorText="Invalid"
        invalid
        label="Invalid"
        placeholder="Invalid"
        [collection]="listCollection.collection()"
        (inputValueChanged)="onInputChange($event)"
      />
      <!-- preview -->
    </div>
  `,
})
export class ComboboxTemplateFormStateDemo {
  readonly listCollection = useListCollection<string>({
    filter: "contains",
    items: countries,
  })

  onInputChange(event: ComboboxInputValueChangeDetails) {
    this.listCollection.filterText.set(event.inputValue)
  }
}
