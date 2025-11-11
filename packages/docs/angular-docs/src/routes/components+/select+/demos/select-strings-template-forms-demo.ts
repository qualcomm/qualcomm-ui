import {JsonPipe} from "@angular/common"
import {Component, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {SelectModule} from "@qualcomm-ui/angular/select"
import {selectCollection} from "@qualcomm-ui/core/select"

@Component({
  imports: [SelectModule, JsonPipe, FormsModule],
  selector: "select-strings-template-forms-demo",
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
export class SelectStringsTemplateFormsDemo {
  // preview
  readonly value = signal<string[]>(["San Diego"])
  // preview

  cityCollection = selectCollection<string>({
    items: [
      "San Diego",
      "Nashville",
      "Denver",
      "Miami",
      "Las Vegas",
      "New York City",
      "San Francisco",
    ],
  })
}
