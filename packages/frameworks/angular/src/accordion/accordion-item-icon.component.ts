import {Directive} from "@angular/core"

import {accordionClasses} from "@qualcomm-ui/qds-core/accordion"

@Directive({
  host: {
    "[class]": "accordionClasses.icon",
  },
  selector: "[q-accordion-item-icon]",
  standalone: false,
})
export class AccordionItemIconComponent {
  protected readonly accordionClasses = accordionClasses
}
