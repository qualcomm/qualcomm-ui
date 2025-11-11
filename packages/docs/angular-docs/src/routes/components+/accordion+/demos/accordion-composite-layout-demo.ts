import {Component} from "@angular/core"

import {AccordionModule} from "@qualcomm-ui/angular/accordion"

import {items} from "./accordion-example-data"

@Component({
  imports: [AccordionModule],
  selector: "accordion-starting-indicator-demo",
  template: `
    <!-- preview -->
    <div class="w-96" q-accordion>
      @for (item of items; track item.value) {
        <div q-accordion-item-root [value]="item.value">
          <button q-accordion-item-trigger>
            <q-accordion-item-indicator />
            <span q-accordion-item-text>
              {{ item.text }}
            </span>
          </button>
          <div q-accordion-item-content>
            {{ item.content }}
          </div>
        </div>
      }
    </div>
    <!-- preview -->
  `,
})
export class AccordionCompositeLayoutDemo {
  readonly items = items
}
