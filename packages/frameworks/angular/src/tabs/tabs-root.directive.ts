import {
  booleanAttribute,
  computed,
  Directive,
  inject,
  input,
} from "@angular/core"

import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {provideRenderStrategyContext} from "@qualcomm-ui/angular-core/presence"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {CoreTabsRootDirective, provideTabsContext} from "@qualcomm-ui/angular-core/tabs"
import {
  createQdsTabsApi,
  type QdsTabsApiProps,
  type QdsTabsIconVariant,
  type QdsTabsSize,
  type QdsTabsVariant,
} from "@qualcomm-ui/qds-core/tabs"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {
  provideQdsTabsContext,
  QdsTabsContextService,
} from "./qds-tabs-context.service"

@Directive({
  providers: [
    provideTabsContext(),
    provideQdsTabsContext(),
    provideRenderStrategyContext(),
  ],
  selector: "[q-tabs-root]",
  standalone: false,
})
export class TabsRootDirective
  extends CoreTabsRootDirective
  implements SignalifyInput<QdsTabsApiProps>
{
  /**
   * If true, the indicator's position change will animate when the active tab
   * changes. Only applies to the `line` variant.
   *
   * @default true
   */
  readonly animateIndicator = input<boolean | undefined, Booleanish>(
    undefined,
    {
      transform: booleanAttribute,
    },
  )

  /**
   * The visual style of tab icons.
   * @option `'ghost'`: The icon is rendered with a transparent background.
   * @option `'filled'`: The icon is rendered with a solid background.
   * @default 'ghost'
   */
  readonly iconVariant = input<QdsTabsIconVariant>()

  /**
   * Governs the size of the tab text, icons, spacing, and padding. Note that `lg`
   * and `xl` are not supported by the contained {@link variant}.
   *
   * @default 'md'
   */
  readonly size = input<QdsTabsSize>()

  /**
   * Governs the appearance of the tab.
   * @option `'line'`: active tab items have a line underneath them.
   * @option `'contained'`: active tab items have a box-like appearance.
   */
  readonly variant = input<QdsTabsVariant>()

  protected readonly qdsTabsService = inject(QdsTabsContextService)

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsTabsService.context().getRootBindings()),
    )
  }

  override ngOnInit() {
    this.qdsTabsService.init(
      computed(() =>
        createQdsTabsApi(
          {
            animateIndicator: this.animateIndicator(),
            iconVariant: this.iconVariant(),
            size: this.size(),
            variant: this.variant(),
          } satisfies Explicit<QdsTabsApiProps>,
          normalizeProps,
        ),
      ),
    )

    super.ngOnInit()
  }
}
