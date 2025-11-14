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
} from "@angular/core"

import {useIsMounted, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {
  normalizeProps,
  useMachine,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import {RenderStrategyContextService} from "@qualcomm-ui/angular-core/presence"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {RenderStrategyApiProps} from "@qualcomm-ui/core/presence"
import {
  createTabsApi,
  type IntlTranslations,
  type TabsActivationMode,
  type TabsApiProps,
  tabsMachine,
  type TabsOrientation,
} from "@qualcomm-ui/core/tabs"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {Direction} from "@qualcomm-ui/utils/direction"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {TabsContextService} from "./tabs-context.service"

@Directive()
export class CoreTabsRootDirective
  implements OnInit, SignalifyInput<TabsApiProps & RenderStrategyApiProps>
{
  /**
   * The activation mode of the tabs.
   * @option `'automatic'`: Tabs are activated when receiving focus
   * @option `'manual'`: Tabs are activated when clicked or the enter key is pressed.
   *
   * @default "automatic"
   */
  readonly activationMode = input<TabsActivationMode | undefined>()

  /**
   * Determines whether tabs act as a standalone composite widget (true) or as a
   * non-focusable component within another widget (false).
   *
   * @default true
   */
  readonly composite = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The initial selected tab value when rendered.
   * Use when you don't need to control the selected tab value.
   */
  readonly defaultValue = input<string | null | undefined>()

  /**
   * Whether the active tab can be deselected when clicking on it.
   */
  readonly deselectable = input<boolean | undefined, Booleanish>(undefined, {
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
   * When true, the component will not be rendered in the DOM until it becomes
   * visible or active.
   *
   * @default false
   */
  readonly lazyMount = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Whether the keyboard navigation will loop from last tab to first, and vice versa.
   * @default true
   */
  readonly loopFocus = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The orientation of the tabs. Can be `horizontal` or `vertical`
   * @option `'horizontal'`: only left and right arrow key navigation will work.
   * @option `'vertical'`: only up and down arrow key navigation will work.
   *
   * @default "horizontal"
   */
  readonly orientation = input<TabsOrientation | undefined>()

  /**
   * Specifies the localized strings that identifies the accessibility elements and
   * their states
   */
  readonly translations = input<IntlTranslations | undefined>()

  /**
   * When true, the component will be completely removed from the DOM when it
   * becomes inactive or hidden, rather than just being hidden with CSS.
   *
   * @default false
   */
  readonly unmountOnExit = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The controlled selected tab value
   */
  readonly value = input<string | null | undefined>()

  /**
   * Callback to be called when the focused tab changes
   */
  readonly focusChanged = output<string>()

  /**
   * Callback to be called when the selected/active tab changes
   */
  readonly valueChanged = output<string>()

  protected readonly document = inject(DOCUMENT)
  protected readonly injector = inject(Injector)
  protected readonly onDestroy = useOnDestroy()

  protected readonly isMounted = useIsMounted()
  protected readonly renderStrategyApi = inject(RenderStrategyContextService)

  protected readonly tabsApi = inject(TabsContextService)

  protected readonly trackBindings = useTrackBindings(() => {
    return this.tabsApi.context().getRootBindings()
  })

  ngOnInit() {
    const machine = useMachine(
      tabsMachine,
      computed<Explicit<TabsApiProps>>(() => ({
        activationMode: this.activationMode(),
        composite: this.composite(),
        defaultValue: this.defaultValue(),
        deselectable: this.deselectable(),
        dir: this.dir(),
        getRootNode: this.getRootNode() ?? (() => this.document),
        loopFocus: this.loopFocus(),
        onFocusChange: (value) => {
          if (this.isMounted()) {
            this.focusChanged.emit(value)
          }
        },
        onValueChange: (value) => {
          if (this.isMounted()) {
            this.valueChanged.emit(value)
          }
        },
        orientation: this.orientation(),
        translations: this.translations(),
        value: this.value(),
      })),
      this.injector,
    )

    this.tabsApi.init(computed(() => createTabsApi(machine, normalizeProps)))

    this.renderStrategyApi.init(
      computed<Explicit<RenderStrategyApiProps>>(() => ({
        lazyMount: this.lazyMount(),
        unmountOnExit: this.unmountOnExit(),
      })),
    )

    this.trackBindings()
  }
}
