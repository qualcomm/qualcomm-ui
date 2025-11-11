import {computed, Directive, input, type OnInit} from "@angular/core"

import {useId} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useAccordionContext} from "./accordion-context.service"
import {useAccordionItemContext} from "./accordion-item-context.service"

@Directive()
export abstract class CoreAccordionItemTriggerDirective implements OnInit {
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.)
   */
  readonly id = input<string>()

  private readonly hostId = computed(() => useId(this, this.id()))

  private readonly accordionContext = useAccordionContext()
  private readonly accordionItemContext = useAccordionItemContext()

  private readonly trackBindings = useTrackBindings(() =>
    this.accordionContext().getAccordionItemTriggerBindings({
      disabled: this.accordionItemContext().disabled,
      id: this.hostId(),
      value: this.accordionItemContext().value,
    }),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
