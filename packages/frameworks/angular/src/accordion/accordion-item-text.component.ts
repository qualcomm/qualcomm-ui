import {Directive} from "@angular/core"

import {CoreAccordionItemTriggerTitleDirective} from "@qualcomm-ui/angular-core/accordion"
import {accordionClasses} from "@qualcomm-ui/qds-core/accordion"

@Directive({
  host: {
    "[class]": "accordionClasses.itemText",
  },
  selector: "[q-accordion-item-text]",
  standalone: false,
})
export class AccordionItemTextComponent extends CoreAccordionItemTriggerTitleDirective {
  protected readonly accordionClasses = accordionClasses
}
