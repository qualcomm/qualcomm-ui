import {computed, Directive, input, type OnInit} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useAccordionContext} from "./accordion-context.service"
import {useAccordionItemContext} from "./accordion-item-context.service"

@Directive()
export class CoreAccordionItemContentDirective implements OnInit {
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.
   */
  readonly id = input<string>()

  protected readonly hostId = computed(() => useId(this, this.id()))

  protected readonly onDestroy = useOnDestroy()

  protected readonly accordionContext = useAccordionContext()
  protected readonly accordionItemContext = useAccordionItemContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.accordionContext().getAccordionItemContentBindings({
      disabled: this.accordionItemContext().disabled,
      id: this.hostId(),
      onDestroy: this.onDestroy,
      value: this.accordionItemContext().value,
    }),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
