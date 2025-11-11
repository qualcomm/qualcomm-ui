import {DOCUMENT} from "@angular/common"
import {
  booleanAttribute,
  computed,
  contentChild,
  Directive,
  inject,
  Injector,
  input,
  type OnInit,
  output,
} from "@angular/core"

import {useIsMounted} from "@qualcomm-ui/angular-core/common"
import {
  normalizeProps,
  useMachine,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createPopoverApi,
  type PopoverApiProps,
  popoverMachine,
} from "@qualcomm-ui/core/popover"
import type {LayerDismissEvent} from "@qualcomm-ui/dom/dismissable"
import type {PositioningOptions} from "@qualcomm-ui/dom/floating-ui"
import type {
  FocusOutsideEvent,
  InteractOutsideEvent,
  PointerDownOutsideEvent,
} from "@qualcomm-ui/dom/interact-outside"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {Direction} from "@qualcomm-ui/utils/direction"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {PopoverContextService} from "./popover-context.service"

@Directive()
export class CorePopoverRootDirective
  implements SignalifyInput<Omit<PopoverApiProps, "ids" | "portalled">>, OnInit
{
  /**
   * Whether to automatically set focus on the first focusable
   * content within the popover when opened.
   *
   * @default true
   */
  readonly autoFocus = input<PopoverApiProps["autoFocus"]>()

  /**
   * Whether to close the popover when the escape key is pressed.
   *
   * @default true
   */
  readonly closeOnEscape = input<boolean | undefined>()

  /**
   * Whether to close the popover when the user clicks outside the popover.
   *
   * @default true
   */
  readonly closeOnInteractOutside = input<boolean | undefined>()

  /**
   * The initial open state of the popover when rendered.
   * Use when you don't need to control the open state of the popover.
   */
  readonly defaultOpen = input<boolean | undefined>()

  /**
   * The document's text/writing direction.
   *
   * @default "ltr"
   */
  readonly dir = input<Direction | undefined>()

  /**
   * A root node to correctly resolve the Document in custom environments. i.e.,
   * Iframes, Electron.
   */
  readonly getRootNode = input<() => ShadowRoot | Document | Node>()

  /**
   * The element to focus on when the popover is opened.
   */
  readonly initialFocusEl = input<(() => HTMLElement | null) | undefined>()

  /**
   * Whether the popover should be modal. When set to `true`:
   * - interaction with outside elements will be disabled
   * - only popover content will be visible to screen readers
   * - scrolling is blocked
   * - focus is trapped within the popover
   *
   * @default false
   */
  readonly modal = input<boolean | undefined>()

  /**
   * The controlled open state of the popover
   */
  readonly open = input<boolean | undefined>()

  /**
   * The persistent elements that:
   * - should not have pointer-events disabled
   * - should not trigger the dismiss event
   */
  readonly persistentElements = input<Array<() => Element | null> | undefined>()

  /**
   * The options used to position the popover content.
   *
   * @inheritDoc
   */
  readonly positioning = input<PositioningOptions>()

  /**
   * On close, restore focus to the element that triggered the open event.
   *
   * @default true
   */
  readonly restoreFocus = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Fired when the popover opens or closes.
   */
  readonly openChanged = output<{open: boolean}>()

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
   * Function called when the pointer is pressed down outside the component
   */
  readonly pointerDownOutside = output<PointerDownOutsideEvent>()

  /**
   * Function called when this layer is closed due to a parent layer being closed
   */
  readonly requestDismissed = output<LayerDismissEvent>()

  protected readonly portalChild = contentChild(PortalDirective, {
    descendants: true,
  })
  protected document = inject(DOCUMENT)
  protected readonly injector = inject(Injector)
  protected readonly isMounted = useIsMounted()
  protected readonly popoverContext = inject(PopoverContextService)
  protected readonly trackBindings = useTrackBindings(() =>
    this.popoverContext.context().getRootBindings(),
  )

  ngOnInit() {
    const machine = useMachine(
      popoverMachine,
      computed<Explicit<PopoverApiProps>>(() => {
        const portal = this.portalChild()
        return {
          autoFocus: this.autoFocus(),
          closeOnEscape: this.closeOnEscape(),
          closeOnInteractOutside: this.closeOnInteractOutside(),
          defaultOpen: this.defaultOpen(),
          dir: this.dir(),
          getRootNode: this.getRootNode() || (() => this.document),
          ids: undefined,
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
              this.openChanged.emit({open})
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
          portalled: portal && !portal.disabled(),
          positioning: this.positioning(),
          restoreFocus: this.restoreFocus(),
        }
      }),
      this.injector,
    )

    this.popoverContext.init(
      computed(() => createPopoverApi(machine, normalizeProps)),
    )

    this.trackBindings()
  }
}
