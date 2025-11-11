import {JsonPipe} from "@angular/common"
import {Component, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {SelectModule} from "@qualcomm-ui/angular/select"
import {selectCollection} from "@qualcomm-ui/core/select"

interface City {
  id: string
  name: string
}

@Component({
  imports: [SelectModule, FormsModule, JsonPipe],
  selector: "select-object-template-forms-demo",
  template: `
    <div class="flex flex-col items-center gap-4">
      <output class="text-neutral-primary font-code-sm block">
        {{ value() | json }}
      </output>
      <q-select
        class="w-48"
        label="City"
        placeholder="Select a city"
        [collection]="cityCollection"
        [(ngModel)]="value"
      />
    </div>
  `,
})
export class SelectObjectTemplateFormsDemo {
  // preview
  readonly value = signal<City[]>([{id: "SD", name: "San Diego"}])
  // preview

  cityCollection = selectCollection<City>({
    itemLabel: (item) => item.name,
    items: [
      {id: "SD", name: "San Diego"},
      {id: "NV", name: "Nashville"},
      {id: "DV", name: "Denver"},
      {id: "MI", name: "Miami"},
      {id: "LV", name: "Las Vegas"},
      {id: "NYC", name: "New York City"},
      {id: "SF", name: "San Francisco"},
    ],
    itemValue: (item) => item.id,
  })
}
