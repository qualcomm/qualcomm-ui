import {Component} from "@angular/core"

import {AccordionModule} from "@qualcomm-ui/angular/accordion"

import {items} from "./accordion-example-data"

@Component({
  imports: [AccordionModule],
  selector: "accordion-secondary-text-demo",
  template: `
    <!-- preview -->
    <div class="w-96" q-accordion>
      @for (item of items; track item.value) {
        <div
          q-accordion-item
          [secondaryText]="item.secondaryText"
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
export class AccordionSecondaryTextDemo {
  readonly items = items
}
