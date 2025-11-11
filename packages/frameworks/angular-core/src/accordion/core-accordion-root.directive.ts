import {
  booleanAttribute,
  computed,
  Directive,
  inject,
  Injector,
  input,
  type OnInit,
  output,
} from "@angular/core"

import {
  useId,
  useIsMounted,
  useOnDestroy,
} from "@qualcomm-ui/angular-core/common"
import {
  normalizeProps,
  useMachine,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  type AccordionApiProps,
  accordionMachine,
  createAccordionApi,
} from "@qualcomm-ui/core/accordion"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {Direction} from "@qualcomm-ui/utils/direction"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {AccordionContextService} from "./accordion-context.service"

@Directive()
export abstract class CoreAccordionRootDirective
  implements SignalifyInput<AccordionApiProps>, OnInit
{
  /**
   * HTML {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.)
   */
  readonly id = input<string>()

  /**
   * The document's text/writing direction.
   */
  readonly dir = input<Direction | undefined>()

  /**
   * Whether sections can be collapsed (in non-multiple mode).
   */
  readonly collapsible = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Initial value of the accordion.
   */
  readonly defaultValue = input<string[] | undefined>()

  /**
   * The disabled state of the accordion.
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Whether multiple accordion items can be expanded at once.
   */
  readonly multiple = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Value(s) of the accordion's open item(s).
   */
  readonly value = input<string[] | undefined>()

  /**
   * Focus change callback.
   */
  readonly focusChanged = output<string | null>()

  /**
   * Value change callback.
   */
  readonly valueChanged = output<string[]>()

  private readonly accordionContext = inject(AccordionContextService)

  private readonly injector = inject(Injector)

  private readonly onDestroy = useOnDestroy()

  private readonly isMounted = useIsMounted()

  readonly hostId = computed(() => useId(this, this.id()))

  protected readonly trackBindings = useTrackBindings(() =>
    this.accordionContext.context().getRootBindings({
      id: this.hostId(),
      onDestroy: this.onDestroy,
    }),
  )

  ngOnInit() {
    const machine = useMachine(
      accordionMachine,
      computed<Explicit<AccordionApiProps>>(() => ({
        collapsible: this.collapsible(),
        defaultValue: this.defaultValue(),
        dir: this.dir(),
        disabled: this.disabled(),
        id: this.hostId(),
        multiple: this.multiple(),
        onFocusChange: (e) => {
          if (this.isMounted()) {
            this.focusChanged.emit(e)
          }
        },
        onValueChange: (e) => {
          if (this.isMounted()) {
            this.valueChanged.emit(e)
          }
        },
        value: this.value(),
      })),
      this.injector,
    )

    this.accordionContext.init(
      computed(() => createAccordionApi(machine, normalizeProps)),
    )

    this.trackBindings()
  }
}
