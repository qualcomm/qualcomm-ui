// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  Component,
  computed,
  contentChild,
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
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {QuiPreloadDirective} from "@qualcomm-ui/angular/transitions"
import {
  createQdsIconButtonApi,
  type QdsButtonDensity,
  type QdsButtonEmphasis,
  type QdsButtonSize,
  type QdsButtonVariant,
  type QdsIconButtonApiProps,
  type QdsIconButtonShape,
  resolveButtonPropsWithGroup,
} from "@qualcomm-ui/qds-core/button"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {useQdsButtonGroupContext} from "./qds-button-group-context.service"
import {
  provideQdsIconButtonContext,
  QdsIconButtonContextService,
} from "./qds-icon-button-context.service"

@Component({
  hostDirectives: [QuiPreloadDirective],
  providers: [provideQdsIconButtonContext()],
  selector: "[q-icon-button]",
  standalone: false,
  template: `
    <ng-content #ref select="svg[qIcon]" />
    @if (icon()) {
      <svg [q-bind]="iconProps()" [qIcon]="icon()!"></svg>
    }
  `,
})
export class IconButtonDirective
  implements SignalifyInput<QdsIconButtonApiProps>, OnInit
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
   * {@link https://lucide.dev/icons lucide-angular} icon.
   */
  readonly icon = input<LucideIconOrString>()

  /**
   * Governs the shape of the icon button.
   *
   * @default 'square'
   */
  readonly shape = input<QdsIconButtonShape>()

  /**
   * The variant of the button.
   *
   * @default 'fill'
   */
  readonly variant = input<QdsButtonVariant>()

  protected readonly trackBindings = useTrackBindings(() =>
    this.iconButtonContext.context().getRootBindings(),
  )

  protected readonly trackIconBindings = useTrackBindings(() =>
    this.iconProps(),
  )

  readonly iconProps = computed(() =>
    this.iconButtonContext.context().getIconBindings(),
  )

  protected readonly iconButtonContext = inject(QdsIconButtonContextService)
  protected readonly buttonGroupContext = useQdsButtonGroupContext({
    optional: true,
  })

  /**
   * Effective size (subclasses may override this based on context).
   */
  protected readonly resolvedSize = computed(() => this.size())

  readonly iconChild = contentChild(IconDirective)

  ngOnInit() {
    const buttonApi = computed(() =>
      createQdsIconButtonApi(
        resolveButtonPropsWithGroup(this.buttonGroupContext?.(), {
          density: this.density(),
          disabled: this.disabled(),
          emphasis: this.emphasis(),
          shape: this.shape(),
          size: this.resolvedSize(),
          variant: this.variant(),
        }),
        normalizeProps,
      ),
    )

    this.iconButtonContext.init(buttonApi)

    const iconContentElement = this.iconChild()?.elementRef
    if (iconContentElement) {
      this.trackIconBindings({elementRef: iconContentElement})
    }

    this.trackBindings()
  }
}
