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
  untracked,
} from "@angular/core"

import {useIsMounted} from "@qualcomm-ui/angular-core/common"
import {normalizeProps, useMachine} from "@qualcomm-ui/angular-core/machine"
import {
  CorePresenceDirective,
  PresenceContextService,
  RenderStrategyContextService,
} from "@qualcomm-ui/angular-core/presence"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createDialogApi,
  type DialogApiProps,
  dialogMachine,
} from "@qualcomm-ui/core/dialog"
import {
  createPresenceApi,
  type PresenceApiProps,
  presenceMachine,
} from "@qualcomm-ui/core/presence"
import type {LayerDismissEvent} from "@qualcomm-ui/dom/dismissable"
import type {
  FocusOutsideEvent,
  InteractOutsideEvent,
  MaybeElement,
  PointerDownOutsideEvent,
} from "@qualcomm-ui/dom/interact-outside"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {Direction} from "@qualcomm-ui/utils/direction"
import {type Explicit, isDefined} from "@qualcomm-ui/utils/guard"

import {DialogContextService} from "./dialog-context.service"

@Directive()
export class CoreDialogRootDirective
  extends CorePresenceDirective
  implements
    SignalifyInput<Omit<DialogApiProps & PresenceApiProps, "aria-label">>,
    OnInit
{
  /**
   * Human-readable label for the dialog, used when the dialog title is not rendered
   */
  readonly ariaLabel = input<string | undefined>(undefined, {
    alias: "aria-label",
  })

  /**
   * Whether to close the dialog when the escape key is pressed
   *
   * @default true
   */
  readonly closeOnEscape = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Whether to close the dialog when the outside is clicked
   *
   * @default true
   */
  readonly closeOnInteractOutside = input<boolean | undefined, Booleanish>(
    undefined,
    {transform: booleanAttribute},
  )

  /**
   * The initial open state of the dialog when rendered.
   * Use when you don't need to control the open state of the dialog.
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
   * Element to receive focus when the dialog is closed
   */
  readonly finalFocusEl = input<(() => MaybeElement) | undefined>()

  /**
   * A root node to correctly resolve the Document in custom environments. i.e.,
   * Iframes, Electron.
   */
  readonly getRootNode = input<
    (() => ShadowRoot | Document | Node) | undefined
  >()

  /**
   * Element to receive focus when the dialog is opened
   */
  readonly initialFocusEl = input<(() => MaybeElement) | undefined>()

  /**
   * Whether to prevent pointer interaction outside the element and hide all content
   * below it
   *
   * @default true
   */
  readonly modal = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The controlled open state of the dialog
   */
  readonly open = input<boolean | undefined>(undefined)

  /**
   * The persistent elements that:
   * - should not have pointer-events disabled
   * - should not trigger the dismiss event
   */
  readonly persistentElements = input<Array<() => Element | null> | undefined>()

  /**
   * Whether to prevent scrolling behind the dialog when it's opened
   *
   * @default true
   */
  readonly preventScroll = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Whether to restore focus to the element that had focus before the dialog was
   * opened
   *
   * @default true
   */
  readonly restoreFocus = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The dialog's role
   *
   * @default 'dialog'
   */
  readonly role = input<"dialog" | "alertdialog" | undefined>()

  /**
   * Whether to trap focus inside the dialog when it's opened
   *
   * @default true
   */
  readonly trapFocus = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Function called when the escape key is pressed
   */
  readonly escapeKeyDown = output<KeyboardEvent>()

  /**
   * Function called when the focus is moved outside the component
   */
  readonly focusOutside = output<FocusOutsideEvent>()

  /**
   * Function called when an interaction happens outside the component
   */
  readonly interactOutside = output<InteractOutsideEvent>()

  /**
   * Fired when the dialog opens or closes.
   */
  readonly openChanged = output<boolean>()

  /**
   * Function called when the pointer is pressed down outside the component
   */
  readonly pointerDownOutside = output<PointerDownOutsideEvent>()

  /**
   * Function called when this layer is closed due to a parent layer being closed
   */
  readonly requestDismissed = output<LayerDismissEvent>()

  protected readonly dialogService = inject(DialogContextService)
  protected readonly presenceService = inject(PresenceContextService)
  protected readonly renderStrategyContext = inject(
    RenderStrategyContextService,
  )
  protected readonly isMounted = useIsMounted()

  private readonly injector = inject(Injector)

  private document = inject(DOCUMENT)

  ngOnInit() {
    const renderStrategy = computed(() => ({
      lazyMount: this.lazyMount() || false,
      unmountOnExit: this.unmountOnExit() || false,
    }))

    const machine = useMachine(
      dialogMachine,
      computed<Explicit<DialogApiProps>>(() => ({
        "aria-label": this.ariaLabel(),
        closeOnEscape: this.closeOnEscape(),
        closeOnInteractOutside: this.closeOnInteractOutside(),
        defaultOpen: this.defaultOpen(),
        dir: this.dir(),
        finalFocusEl: this.finalFocusEl(),
        getRootNode: this.getRootNode() || (() => this.document),
        initialFocusEl: this.initialFocusEl(),
        modal: this.modal(),
        onEscapeKeyDown: (event) => {
          if (this.isMounted()) {
            this.escapeKeyDown.emit(event)
          }
        },
        onFocusOutside: (event) => {
          if (this.isMounted()) {
            this.focusOutside.emit(event)
          }
        },
        onInteractOutside: (event) => {
          if (this.isMounted()) {
            this.interactOutside.emit(event)
          }
        },
        onOpenChange: (open) => {
          if (this.isMounted()) {
            this.openChanged.emit(open)
          }
        },
        onPointerDownOutside: (event) => {
          if (this.isMounted()) {
            this.pointerDownOutside.emit(event)
          }
        },
        onRequestDismiss: (event) => {
          if (this.isMounted()) {
            this.requestDismissed.emit(event)
          }
        },
        open: this.open(),
        persistentElements: this.persistentElements(),
        preventScroll: this.preventScroll(),
        restoreFocus: this.restoreFocus(),
        role: this.role(),
        trapFocus: this.trapFocus(),
      })),
      this.injector,
    )

    const dialogApi = computed(() => createDialogApi(machine, normalizeProps))

    this.dialogService.init(dialogApi)

    const presence = useMachine(
      presenceMachine,
      computed<Explicit<PresenceApiProps>>(() => {
        const present = this.present()
        const api = dialogApi()
        const showing = isDefined(present) ? present : api.open
        untracked(() => {
          if (this.presenceService.initialized()) {
            this.presenceService.immediatePresent = showing
          }
        })
        return {
          immediate: this.immediate(),
          lazyMount: this.lazyMount(),
          onExitComplete: () => {
            if (this.isMounted()) {
              this.exitCompleted.emit()
            }
          },
          present: showing,
          skipAnimationOnMount: this.skipAnimationOnMount(),
          unmountOnExit: this.unmountOnExit(),
        }
      }),
      this.injector,
    )

    this.presenceService.init(
      computed(() => createPresenceApi(presence, normalizeProps)),
    )

    this.renderStrategyContext.init(renderStrategy)
  }
}
