import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useAccordionContext} from "./accordion-context.service"
import {useAccordionItemContext} from "./accordion-item-context.service"

@Directive()
export abstract class CoreAccordionItemTriggerSecondaryDirective
  implements OnInit
{
  private readonly accordionContext = useAccordionContext()
  private readonly accordionItemContext = useAccordionItemContext()

  private readonly trackBindings = useTrackBindings(() =>
    this.accordionContext().getAccordionItemSecondaryTextBindings({
      disabled: this.accordionItemContext().disabled,
      value: this.accordionItemContext().value,
    }),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
