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

import {IconDirective} from "@qualcomm-ui/angular/icon"
import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {
  normalizeProps,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createQdsIconButtonApi,
  type QdsButtonDensity,
  type QdsButtonEmphasis,
  type QdsButtonSize,
  type QdsButtonVariant,
  type QdsIconButtonApiProps,
} from "@qualcomm-ui/qds-core/button"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {
  provideQdsIconButtonContext,
  QdsIconButtonContextService,
} from "./qds-icon-button-context.service"

@Component({
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

  readonly iconChild = contentChild(IconDirective)

  ngOnInit() {
    const buttonApi = computed(() => {
      return createQdsIconButtonApi(
        {
          density: this.density(),
          disabled: this.disabled(),
          emphasis: this.emphasis(),
          size: this.size(),
          variant: this.variant(),
        },
        normalizeProps,
      )
    })

    this.iconButtonContext.init(buttonApi)

    const iconContentElement = this.iconChild()?.elementRef
    if (iconContentElement) {
      this.trackIconBindings({elementRef: iconContentElement})
    }

    this.trackBindings()
  }
}
