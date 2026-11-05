// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  computed,
  Directive,
  inject,
  input,
  type OnInit,
} from "@angular/core"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {
  normalizeProps,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createQdsButtonApi,
  type QdsButtonApiProps,
  type QdsButtonDensity,
  type QdsButtonEmphasis,
  type QdsButtonSize,
  type QdsButtonVariant,
  resolveButtonProps,
} from "@qualcomm-ui/qds-core/button"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {QdsButtonContextService} from "./qds-button-context.service"
import {useQdsButtonGroupContext} from "./qds-button-group-context.service"
import {useQdsButtonPropsContext} from "./qds-button-props-context.service"

@Directive()
export class BaseButtonDirective
  implements SignalifyInput<QdsButtonApiProps>, OnInit
{
  /**
   * The density of the button. Governs padding and height.
   *
   * @default 'default'
   */
  readonly density = input<QdsButtonDensity>()

  /**
   * Controls whether the component is interactive. When `true`, pointer/focus
   * events are blocked, and the component is visually dimmed.
   *
   * @default false
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The variant of the button.
   *
   * @default 'neutral'
   */
  readonly emphasis = input<QdsButtonEmphasis>()

  /**
   * The size of the component and its icons.
   *
   * @default 'md'
   */
  readonly size = input<QdsButtonSize>()

  /**
   * {@link https://lucide.dev/icons lucide-angular} icon, positioned before the label.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   * ```angular-html
   * <svg q-start-icon icon="..."></svg>
   * ```
   */
  readonly startIcon = input<LucideIconOrString>()

  /**
   * The variant of the button.
   *
   * @default 'fill'
   */
  readonly variant = input<QdsButtonVariant>()

  readonly buttonService = inject(QdsButtonContextService)
  protected readonly buttonGroupContext = useQdsButtonGroupContext({
    optional: true,
  })
  protected readonly buttonPropsContext = useQdsButtonPropsContext({
    optional: true,
  })

  /**
   * The button's own size, before group and context defaults are applied.
   * Subclasses may supply a fallback.
   */
  protected readonly ownSize = computed(() => this.size())

  protected readonly trackBindings = useTrackBindings(() =>
    this.buttonService.context().getRootBindings(),
  )

  ngOnInit() {
    const buttonApi = computed(() =>
      createQdsButtonApi(
        resolveButtonProps(
          {
            density: this.density(),
            disabled: this.disabled(),
            emphasis: this.emphasis(),
            size: this.ownSize(),
            variant: this.variant(),
          },
          {
            defaults: this.buttonPropsContext?.(),
            group: this.buttonGroupContext?.(),
          },
        ),
        normalizeProps,
      ),
    )

    this.buttonService.init(buttonApi)
    this.trackBindings()
  }
}
