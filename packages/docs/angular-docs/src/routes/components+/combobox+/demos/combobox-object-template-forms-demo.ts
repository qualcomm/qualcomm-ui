import {JsonPipe} from "@angular/common"
import {Component, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {comboboxCollection} from "@qualcomm-ui/core/combobox"

interface Country {
  id: string
  name: string
}

@Component({
  imports: [ComboboxModule, FormsModule, JsonPipe],
  selector: "combobox-object-template-forms-demo",
  template: `
    <div class="flex flex-col items-center gap-4">
      <output class="text-neutral-primary font-code-sm block">
        {{ value() | json }}
      </output>
      <q-combobox
        class="w-48"
        label="Country"
        placeholder="Select a country"
        [collection]="countryCollection"
        [(ngModel)]="value"
      />
    </div>
  `,
})
export class ComboboxObjectTemplateFormsDemo {
  // preview
  readonly value = signal<Country[]>([{id: "US", name: "United States"}])
  // preview

  readonly countryCollection = comboboxCollection<Country>({
    itemLabel: (item) => item.name,
    items: [
      {id: "US", name: "United States"},
      {id: "CA", name: "Canada"},
      {id: "MX", name: "Mexico"},
      {id: "UK", name: "United Kingdom"},
      {id: "FR", name: "France"},
      {id: "DE", name: "Germany"},
      {id: "JP", name: "Japan"},
    ],
    itemValue: (item) => item.id,
  })
}
