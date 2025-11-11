import {Component} from "@angular/core"
import {FileChartColumn} from "lucide-angular"

import {AccordionModule} from "@qualcomm-ui/angular/accordion"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

import {items} from "./accordion-example-data"

@Component({
  imports: [AccordionModule],
  providers: [provideIcons({FileChartColumn})],
  selector: "accordion-icon-demo",
  template: `
    <!-- preview -->
    <div class="w-96" q-accordion>
      @for (item of items; track item.value) {
        <div
          icon="FileChartColumn"
          q-accordion-item
          [text]="item.text"
          [value]="item.value"
        >
          {{ item.content }}
        </div>
      }
    </div>
    <!-- preview -->
  `,
})
export class AccordionIconDemo {
  readonly items = items
}
