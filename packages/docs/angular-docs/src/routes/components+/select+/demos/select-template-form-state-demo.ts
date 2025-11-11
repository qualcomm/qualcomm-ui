import {Component} from "@angular/core"

import {SelectModule} from "@qualcomm-ui/angular/select"
import {selectCollection} from "@qualcomm-ui/core/select"

@Component({
  imports: [SelectModule],
  selector: "select-template-form-state-demo",
  template: `
    <div class="flex w-60 flex-col gap-4">
      <!-- preview -->
      <q-select
        disabled
        label="Disabled"
        placeholder="Disabled"
        [collection]="cityCollection"
      />
      <q-select
        label="Read only"
        placeholder="Read only"
        readOnly
        [collection]="cityCollection"
      />
      <q-select
        errorText="Invalid"
        invalid
        label="Invalid"
        placeholder="Invalid"
        [collection]="cityCollection"
      />
      <!-- preview -->
    </div>
  `,
})
export class SelectTemplateFormStateDemo {
  cityCollection = selectCollection({
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
