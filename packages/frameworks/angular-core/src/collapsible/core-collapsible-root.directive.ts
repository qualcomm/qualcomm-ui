import {DOCUMENT} from "@angular/common"
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
  normalizeProps,
  useMachine,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  type CollapsibleApiProps,
  collapsibleMachine,
  createCollapsibleApi,
} from "@qualcomm-ui/core/collapsible"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {Direction} from "@qualcomm-ui/utils/direction"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {CollapsibleContextService} from "./collapsible-context.service"

@Directive()
export class CoreCollapsibleRootDirective
  implements OnInit, SignalifyInput<CollapsibleApiProps>
{
  /**
   * The initial open state of the collapsible when rendered.
   * Use when you don't need to control the open state of the collapsible.
   */
  readonly defaultOpen = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The document's text/writing direction.
   *
   * @default "ltr"
   */
  readonly dir = input<Direction | undefined>(undefined)

  /**
   * Whether the collapsible is disabled.
   */
  readonly disabled = input<boolean | undefined>()

  /**
   * A root node to correctly resolve the Document in custom environments. i.e.,
   * Iframes, Electron.
   */
  readonly getRootNode = input<
    (() => ShadowRoot | Document | Node) | undefined
  >()

  /**
   * The controlled open state of the collapsible
   */
  readonly open = input<boolean | undefined>()

  /**
   * Function called when the animation ends in the closed state
   */
  readonly exitCompleted = output<void>()

  /**
   * Function called when {@link open} changes.
   */
  readonly openChanged = output<boolean>()

  readonly collapsibleService = inject(CollapsibleContextService)

  private readonly injector = inject(Injector)
  private readonly document = inject(DOCUMENT)

  protected readonly trackBindings = useTrackBindings(() => {
    return this.collapsibleService.context().getRootBindings()
  })

  ngOnInit() {
    const machine = useMachine(
      collapsibleMachine,
      computed<Explicit<CollapsibleApiProps>>(() => ({
        defaultOpen: this.defaultOpen(),
        dir: this.dir(),
        disabled: this.disabled(),
        forceMeasureOnOpen: true,
        getRootNode: this.getRootNode() || (() => this.document),
        onExitComplete: () => this.exitCompleted.emit(),
        onOpenChange: (open) => this.openChanged.emit(open),
        open: this.open(),
      })),
      this.injector,
    )

    const collapsibleApi = computed(() =>
      createCollapsibleApi(machine, normalizeProps),
    )

    this.collapsibleService.init(collapsibleApi)

    this.trackBindings()
  }
}
