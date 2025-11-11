// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

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

import {useId, useIsMounted} from "@qualcomm-ui/angular-core/common"
import {normalizeProps, useMachine} from "@qualcomm-ui/angular-core/machine"
import {
  CorePresenceDirective,
  PresenceContextService,
} from "@qualcomm-ui/angular-core/presence"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createMenuApi,
  type MenuApiProps,
  menuMachine,
  type MenuNavigateDetails,
} from "@qualcomm-ui/core/menu"
import {
  createPresenceApi,
  type PresenceApiProps,
  presenceMachine,
} from "@qualcomm-ui/core/presence"
import type {LayerDismissEvent} from "@qualcomm-ui/dom/dismissable"
import type {PositioningOptions} from "@qualcomm-ui/dom/floating-ui"
import type {
  FocusOutsideEvent,
  InteractOutsideEvent,
  PointerDownOutsideEvent,
} from "@qualcomm-ui/dom/interact-outside"
import type {Point} from "@qualcomm-ui/dom/rect-utils"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {Direction} from "@qualcomm-ui/utils/direction"
import {type Explicit, isDefined} from "@qualcomm-ui/utils/guard"
import type {IdRegistrationProps} from "@qualcomm-ui/utils/machine"

import {MenuContextService, useMenuContext} from "./menu-context.service"
import {
  MenuMachineContextService,
  useMenuMachineContext,
} from "./menu-machine-context.service"
import {MenuTriggerContextService} from "./menu-trigger-context.service"

@Directive()
export class CoreMenuRootDirective
  extends CorePresenceDirective
  implements
    OnInit,
    SignalifyInput<Omit<MenuApiProps, "id" | "navigate"> & PresenceApiProps>
{
  /**
   * The positioning point for the menu. Can be set by the context menu trigger or
   * the button trigger.
   */
  readonly anchorPoint = input<Point | null | undefined>()

  /**
   * Whether to close the menu when an option is selected
   * @default true
   */
  readonly closeOnSelect = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Whether the menu is composed with other composite widgets like a combobox or tabs
   * @default true
   */
  readonly composite = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The initial highlighted value of the menu item when rendered.
   * Use when you don't need to control the highlighted value of the menu item.
   */
  readonly defaultHighlightedValue = input<string | null | undefined>()

  /**
   * The initial open state of the menu when rendered.
   * Use when you don't need to control the open state of the menu.
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
   * A root node to correctly resolve the Document in custom environments. i.e.,
   * Iframes, Electron.
   */
  readonly getRootNode = input<
    (() => ShadowRoot | Document | Node) | undefined
  >()

  /**
   * The controlled highlighted value of the menu item.
   */
  readonly highlightedValue = input<string | undefined | null>()

  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.)
   */
  readonly id = input<string>()

  /**
   * Whether to loop the keyboard navigation.
   * @default false
   */
  readonly loopFocus = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The controlled open state of the menu
   */
  readonly open = input<boolean | undefined>()

  /**
   * The options used to dynamically position the menu
   * @inheritDoc
   */
  readonly positioning = input<PositioningOptions | undefined>()

  /**
   * Whether the pressing printable characters should trigger typeahead navigation
   * @default true
   */
  readonly typeahead = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Function called when the highlighted menu item changes.
   */
  highlightChanged = output<string | null>()

  /**
   * Function to navigate to the selected item if it's an anchor element
   */
  readonly navigate = output<MenuNavigateDetails>()

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
   * Function called when the open state changes
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

  /**
   * Function called when a menu item is selected.
   */
  readonly selected = output<string>()

  protected readonly document = inject(DOCUMENT)
  protected readonly isMounted = useIsMounted()
  protected readonly menuService = inject(MenuContextService)
  protected readonly menuMachineService = inject(MenuMachineContextService)
  protected readonly menuTriggerService = inject(MenuTriggerContextService)
  protected readonly presenceService = inject(PresenceContextService)
  protected readonly injector = inject(Injector)
  protected readonly hostId = computed(() => useId(this, this.id()))

  protected readonly parentMachineContext = useMenuMachineContext({
    optional: true,
    skipSelf: true,
  })
  protected readonly parentMenuContext = useMenuContext({
    optional: true,
    skipSelf: true,
  })

  ngOnInit() {
    const machine = useMachine(
      menuMachine,
      computed<Explicit<MenuApiProps>>(() => ({
        anchorPoint: this.anchorPoint(),
        closeOnSelect: this.closeOnSelect(),
        composite: this.composite(),
        defaultHighlightedValue: this.defaultHighlightedValue(),
        defaultOpen: this.defaultOpen(),
        dir: this.dir(),
        getRootNode: this.getRootNode() || (() => this.document),
        highlightedValue: this.highlightedValue(),
        id: this.hostId(),
        loopFocus: this.loopFocus(),
        navigate: (details) => {
          if (this.isMounted()) {
            this.navigate.emit(details)
          }
        },
        onEscapeKeyDown: (event) => {
          if (this.isMounted()) {
            this.escapeKeyDown.emit(event)
          }
        },
        onFocusOutside: (value) => {
          if (this.isMounted()) {
            this.focusOutside.emit(value)
          }
        },
        onHighlightChange: (value) => {
          if (this.isMounted()) {
            this.highlightChanged.emit(value)
          }
        },
        onInteractOutside: (value) => {
          if (this.isMounted()) {
            this.interactOutside.emit(value)
          }
        },
        onOpenChange: (value) => {
          if (this.isMounted()) {
            this.openChanged.emit(value)
          }
        },
        onPointerDownOutside: (value) => {
          if (this.isMounted()) {
            this.pointerDownOutside.emit(value)
          }
        },
        onRequestDismiss: (event) => {
          if (this.isMounted()) {
            this.requestDismissed.emit(event)
          }
        },
        onSelect: (value) => {
          this.selected.emit(value)
        },
        open: this.open(),
        positioning: this.positioning(),
        typeahead: this.typeahead(),
      })),
      this.injector,
    )

    const menuApi = computed(() => createMenuApi(machine, normalizeProps))

    // sub-menu check
    if (this.parentMenuContext && this.parentMachineContext) {
      this.parentMenuContext().setChild(machine)
      menuApi().setParent(this.parentMachineContext())
    }

    this.menuService.init(menuApi)

    this.menuMachineService.init(computed(() => machine))

    this.menuTriggerService.init(
      computed(() => {
        return (params: IdRegistrationProps) => {
          return this.parentMenuContext?.()?.getTriggerItemBindings?.(
            menuApi(),
            params,
          )
        }
      }),
    )

    const presence = useMachine(
      presenceMachine,
      computed<Explicit<PresenceApiProps>>(() => {
        const present = this.present()
        const api = menuApi()
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
            this.exitCompleted.emit()
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
  }
}
