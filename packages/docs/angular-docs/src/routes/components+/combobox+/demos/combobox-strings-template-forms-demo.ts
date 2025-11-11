import {JsonPipe} from "@angular/common"
import {Component, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {useListCollection} from "@qualcomm-ui/angular-core/collection"
import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"

import {countries} from "./country-list"

@Component({
  imports: [ComboboxModule, FormsModule, JsonPipe],
  selector: "combobox-strings-template-forms-demo",
  template: `
    <div class="flex flex-col items-center gap-4">
      <output class="text-neutral-primary font-code-sm block">
        {{ value() | json }}
      </output>
      <q-combobox
        class="w-48"
        label="Country"
        placeholder="Select a country"
        [collection]="listCollection.collection()"
        [(ngModel)]="value"
        (inputValueChanged)="onInputChange($event)"
      />
    </div>
  `,
})
export class ComboboxStringsTemplateFormsDemo {
  // preview
  readonly value = signal<string[]>([countries[0]])
  // preview

  readonly listCollection = useListCollection<string>({
    filter: "contains",
    items: countries,
  })

  onInputChange(event: ComboboxInputValueChangeDetails) {
    this.listCollection.filterText.set(event.inputValue)
  }
}
