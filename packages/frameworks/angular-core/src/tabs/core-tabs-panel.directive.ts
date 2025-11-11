import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  linkedSignal,
  type OnInit,
} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useMachine, useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {
  PresenceContextService,
  usePresenceRenderer,
  useRenderStrategyContext,
} from "@qualcomm-ui/angular-core/presence"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {createPresenceApi, presenceMachine} from "@qualcomm-ui/core/presence"
import type {PanelProps} from "@qualcomm-ui/core/tabs"

import {useTabsContext} from "./tabs-context.service"

@Directive()
export class CoreTabsPanelDirective
  implements OnInit, SignalifyInput<PanelProps>
{
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.
   */
  readonly id = input<string>()

  /**
   * The value of the associated tab
   */
  readonly value = input.required<string>()

  protected readonly tabsContext = useTabsContext()
  protected readonly elementRef = inject(ElementRef)

  protected readonly hostId = linkedSignal(() => useId(this, this.id()))
  protected readonly presenceService = inject(PresenceContextService)
  protected readonly renderStrategyContext = useRenderStrategyContext()

  protected readonly onDestroy = useOnDestroy()

  protected readonly presenceRenderer = usePresenceRenderer()

  protected readonly injector = inject(Injector)

  protected readonly trackBindings = useTrackBindings(() => {
    return this.tabsContext().getPanelBindings({
      id: this.hostId(),
      onDestroy: this.onDestroy,
      value: this.value(),
    })
  })

  constructor() {
    effect(() => {
      const element = this.elementRef.nativeElement
      if (this.presenceService.unmounted()) {
        this.presenceService.setNode(null)
      } else {
        this.presenceService.setNode(element)
      }
    })
  }

  ngOnInit() {
    const machine = useMachine(
      presenceMachine,
      computed(() => ({
        lazyMount: this.renderStrategyContext().lazyMount,
        present: this.tabsContext().value === this.value(),
        unmountOnExit: this.renderStrategyContext().unmountOnExit,
      })),
      this.injector,
    )

    this.presenceService.init(computed(() => createPresenceApi(machine)))

    this.trackBindings()
  }
}
