import {Component} from "@angular/core"

import {AccordionModule} from "@qualcomm-ui/angular/accordion"
import {LoremIpsumDirective} from "@qualcomm-ui/angular-core/lorem-ipsum"

@Component({
  imports: [AccordionModule, LoremIpsumDirective],
  selector: "accordion-simple-directives-demo",
  template: `
    <div class="w-96" q-accordion [defaultValue]="['a']">
      <!-- preview -->
      <div q-accordion-item value="a">
        <div data-test-id="accordion-1" q-accordion-item-text>
          Accordion Text 1
        </div>
        <div q-accordion-item-secondary-text>Secondary text</div>
        <div q-lorem-ipsum></div>
      </div>
      <!-- preview -->
      <div q-accordion-item value="b">
        <div data-test-id="accordion-2" q-accordion-item-text>
          Accordion Text 2
        </div>
        <div q-accordion-item-secondary-text>Secondary text</div>
        <div q-lorem-ipsum></div>
      </div>
    </div>
  `,
})
export class AccordionSimpleDirectivesDemo {}
