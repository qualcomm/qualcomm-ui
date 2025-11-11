import {Component} from "@angular/core"

import {AccordionModule} from "@qualcomm-ui/angular/accordion"

import {items} from "./accordion-example-data"

@Component({
  imports: [AccordionModule],
  selector: "accordion-multiple-demo",
  template: `
    <!-- preview -->
    <div class="w-96" multiple q-accordion>
      @for (item of items; track item.value) {
        <div q-accordion-item [text]="item.text" [value]="item.value">
          {{ item.content }}
        </div>
      }
    </div>
    <!-- preview -->
  `,
})
export class AccordionMultipleDemo {
  readonly items = items
}
