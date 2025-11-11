import {Component, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {TagDirective} from "@qualcomm-ui/angular/tag"
import {useListCollection} from "@qualcomm-ui/angular-core/collection"
import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"

import {countries} from "./country-list"

@Component({
  imports: [ComboboxModule, TagDirective, FormsModule],
  selector: "combobox-multiple-demo",
  template: `
    <div class="flex w-72 flex-col gap-4">
      <div class="flex flex-wrap gap-2">
        @for (item of value(); track item) {
          <button
            emphasis="neutral"
            q-tag
            variant="dismissable"
            (click)="handleValueDismissed(item)"
          >
            {{ item }}
          </button>
        }
      </div>
      <q-combobox
        class="w-full"
        label="Country"
        multiple
        placeholder="Select a country"
        [collection]="listCollection.collection()"
        [(ngModel)]="value"
        (inputValueChanged)="onInputChange($event)"
      />
    </div>
  `,
})
export class ComboboxMultipleDemo {
  readonly value = signal<string[]>([])

  readonly listCollection = useListCollection<string>({
    filter: "contains",
    items: countries,
  })

  onInputChange(event: ComboboxInputValueChangeDetails) {
    this.listCollection.filterText.set(event.inputValue)
  }

  handleValueDismissed(item: string) {
    this.value.set(this.value().filter((v) => v !== item))
  }
}
