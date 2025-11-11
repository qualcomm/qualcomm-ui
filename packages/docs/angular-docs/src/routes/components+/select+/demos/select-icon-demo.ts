import {Component} from "@angular/core"
import {MapPin} from "lucide-angular"

import {SelectModule} from "@qualcomm-ui/angular/select"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {selectCollection} from "@qualcomm-ui/core/select"

@Component({
  imports: [SelectModule],
  providers: [provideIcons({MapPin})],
  selector: "select-icon-demo",
  template: `
    <!-- preview -->
    <q-select
      class="w-48"
      icon="MapPin"
      label="City"
      placeholder="Select a city"
      [collection]="cityCollection"
    />
    <!-- preview -->
  `,
})
export class SelectIconDemo {
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
