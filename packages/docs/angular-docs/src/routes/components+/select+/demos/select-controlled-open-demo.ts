import {Component, signal} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {SelectModule} from "@qualcomm-ui/angular/select"
import {selectCollection} from "@qualcomm-ui/core/select"

@Component({
  imports: [SelectModule, ButtonModule],
  selector: "select-controlled-open-demo",
  template: `
    <!-- preview -->
    <q-select
      class="w-48"
      label="City"
      placeholder="Select a city"
      [collection]="cityCollection"
      [open]="isOpen()"
      (openChanged)="isOpen.set($event)"
    />
    <!-- preview -->
  `,
})
export class SelectControlledOpenDemo {
  protected readonly isOpen = signal<boolean>(false)

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
