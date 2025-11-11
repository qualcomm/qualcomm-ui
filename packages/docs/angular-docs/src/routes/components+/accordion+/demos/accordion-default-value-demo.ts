import {Component} from "@angular/core"

import {AccordionModule} from "@qualcomm-ui/angular/accordion"

import {items} from "./accordion-example-data"

@Component({
  imports: [AccordionModule],
  selector: "accordion-default-value-demo",
  template: `
    <!-- preview -->
    <div class="w-96" q-accordion [defaultValue]="['a']">
      @for (item of items; track item.value) {
        <div q-accordion-item [text]="item.text" [value]="item.value">
          {{ item.content }}
        </div>
      }
    </div>
    <!-- preview -->
  `,
})
export class AccordionDefaultValueDemo {
  readonly items = items
}
