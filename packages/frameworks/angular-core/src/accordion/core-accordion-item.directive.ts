import {
  computed,
  Directive,
  inject,
  input,
  type OnInit,
  signal,
} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {AccordionItemApiProps} from "@qualcomm-ui/core/accordion"

import {useAccordionContext} from "./accordion-context.service"
import {AccordionItemContextService} from "./accordion-item-context.service"

@Directive()
export abstract class CoreAccordionItemDirective
  implements SignalifyInput<AccordionItemApiProps>, OnInit
{
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.)
   */
  readonly id = input<string>()

  readonly value = input<string>("")

  readonly disabled = input<boolean | undefined>()

  private readonly accordionItemContext = inject(AccordionItemContextService)

  private readonly hostId = computed(() => useId(this, this.id()))

  protected readonly accordionContext = useAccordionContext()

  protected readonly onDestroy = useOnDestroy()

  private readonly isDisabled = signal<boolean | undefined>(undefined)

  private readonly trackBindings = useTrackBindings(() => {
    const contextProps = this.accordionContext().getAccordionItemBindings({
      disabled: this.disabled(),
      id: this.hostId(),
      onDestroy: this.onDestroy,
      value: this.value(),
    })
    this.isDisabled.set(contextProps.disabled)
    return contextProps
  })

  ngOnInit() {
    this.accordionItemContext.init(
      computed(() => ({
        disabled: this.isDisabled(),
        value: this.value(),
      })),
    )

    this.trackBindings()
  }
}
