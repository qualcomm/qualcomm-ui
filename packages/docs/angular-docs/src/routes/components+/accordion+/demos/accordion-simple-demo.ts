import {Component} from "@angular/core"

import {AccordionModule} from "@qualcomm-ui/angular/accordion"
import {LoremIpsumDirective} from "@qualcomm-ui/angular-core/lorem-ipsum"

@Component({
  imports: [AccordionModule, LoremIpsumDirective],
  selector: "accordion-simple-demo",
  template: `
    <!-- preview -->
    <div class="w-96" q-accordion [defaultValue]="['a']">
      <div
        q-accordion-item
        secondaryText="Secondary text"
        text="Accordion Text 1"
        value="a"
      >
        <div q-lorem-ipsum></div>
      </div>
      <div
        q-accordion-item
        secondaryText="Secondary text"
        text="Accordion Text 2"
        value="b"
      >
        <div q-lorem-ipsum></div>
      </div>
    </div>
    <!-- preview -->
  `,
})
export class AccordionSimpleDemo {}
