import {computed, Directive, inject, input} from "@angular/core"

import {
  provideQdsInputContext,
  QdsInputContextService,
} from "@qualcomm-ui/angular/input"
import {
  CoreComboboxRootDirective,
  provideComboboxContext,
} from "@qualcomm-ui/angular-core/combobox"
import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {providePresenceContext} from "@qualcomm-ui/angular-core/presence"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {createQdsInputApi} from "@qualcomm-ui/qds-core/input"
import {
  createQdsSelectApi,
  type QdsSelectApi,
  type QdsSelectApiProps,
  type QdsSelectSize,
} from "@qualcomm-ui/qds-core/select"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {
  provideQdsComboboxContext,
  QdsComboboxContextService,
} from "./qds-combobox-context.service"

@Directive({
  providers: [
    provideComboboxContext(),
    provideQdsComboboxContext(),
    provideQdsInputContext(),
    providePresenceContext(),
  ],
  selector: "[q-combobox-root]",
  standalone: false,
})
export class ComboboxRootDirective
  extends CoreComboboxRootDirective
  implements SignalifyInput<QdsSelectApiProps>
{
  /**
   * {@link https://lucide.dev lucide icon}, positioned at the start of the control element.
   */
  readonly icon = input<LucideIconOrString>()

  /**
   * The size of the combobox and its elements. Governs properties like font size,
   * item padding, and icon sizes.
   *
   * @default 'md'
   */
  readonly size = input<QdsSelectSize>("md")

  protected readonly qdsComboboxService = inject(QdsComboboxContextService)
  protected readonly qdsInputService = inject(QdsInputContextService)

  override ngOnInit() {
    this.trackBindings.extendWith(
      computed(() => this.qdsComboboxService.context().getRootBindings()),
    )

    this.qdsComboboxService.init(
      computed<QdsSelectApi>(() =>
        createQdsSelectApi(
          {
            size: this.size(),
          } satisfies Explicit<QdsSelectApiProps>,
          normalizeProps,
        ),
      ),
    )

    this.qdsInputService.init(
      computed(() =>
        createQdsInputApi(
          {
            size: this.size(),
            startIcon: this.icon(),
          },
          normalizeProps,
        ),
      ),
    )

    super.ngOnInit()
  }
}
