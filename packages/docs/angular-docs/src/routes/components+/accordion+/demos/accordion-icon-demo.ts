import {Component} from "@angular/core"
import {LucideFileChartColumn} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {AccordionModule} from "@qualcomm-ui/angular/accordion"

import {items} from "./accordion-example-data"

@Component({
  imports: [AccordionModule],
  providers: [provideIcons({LucideFileChartColumn})],
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
