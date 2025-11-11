import {Component} from "@angular/core"

import {AccordionModule} from "@qualcomm-ui/angular/accordion"
import {LoremIpsumDirective} from "@qualcomm-ui/angular-core/lorem-ipsum"

@Component({
  imports: [AccordionModule, LoremIpsumDirective],
  selector: "accordion-composite-demo",
  template: `
    <div class="w-96" q-accordion>
      <!-- preview -->
      <div q-accordion-item-root value="a">
        <button q-accordion-item-trigger>
          <span q-accordion-item-text>Accordion Text 1</span>
          <span q-accordion-item-secondary-text>Secondary text</span>
          <q-accordion-item-indicator />
        </button>
        <div q-accordion-item-content>
          <div q-lorem-ipsum></div>
        </div>
      </div>
      <!-- preview -->

      <div q-accordion-item-root value="b">
        <button q-accordion-item-trigger>
          <span q-accordion-item-text>Accordion Text 2</span>
          <span q-accordion-item-secondary-text>Secondary text</span>
          <q-accordion-item-indicator />
        </button>
        <div q-accordion-item-content>
          <div q-lorem-ipsum></div>
        </div>
      </div>
    </div>
  `,
})
export class AccordionCompositeDemo {}
