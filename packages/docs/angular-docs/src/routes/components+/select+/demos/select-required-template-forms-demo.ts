import {Component, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {SelectModule} from "@qualcomm-ui/angular/select"
import {selectCollection} from "@qualcomm-ui/core/select"

@Component({
  imports: [SelectModule, FormsModule],
  selector: "select-required-template-forms-demo",
  template: `
    <!-- preview -->
    <q-select
      class="w-48"
      errorText="Please select a city"
      label="City"
      placeholder="Select a city"
      required
      [collection]="cityCollection"
      [(ngModel)]="value"
    />
    <!-- preview -->
  `,
})
export class SelectRequiredTemplateFormsDemo {
  readonly value = signal<string[]>([])

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
