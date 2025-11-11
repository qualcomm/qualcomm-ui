import {Component, input, type OnInit} from "@angular/core"
import {X} from "lucide-angular"

import {IconDirective} from "@qualcomm-ui/angular/icon"
import type {LucideIcon} from "@qualcomm-ui/angular-core/lucide"
import {
  QBindDirective,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  type QdsInlineIconButtonApiProps,
  type QdsInlineIconButtonEmphasis,
  type QdsInlineIconButtonSize,
  type QdsInlineIconButtonVariant,
} from "@qualcomm-ui/qds-core/inline-icon-button"

import {useInlineIconButtonApi} from "./use-inline-icon-button-api"

@Component({
  imports: [IconDirective, QBindDirective],
  selector: "[q-inline-icon-button]",
  template: `
    <svg [q-bind]="api().getIconBindings()" [qIcon]="icon()"></svg>
  `,
})
export class InlineIconButtonComponent
  implements SignalifyInput<QdsInlineIconButtonApiProps>, OnInit
{
  /**
   * @default X
   */
  readonly icon = input<LucideIcon>(X)

  /**
   * The style variant of the button. Governs color.
   *
   * @default 'neutral'
   */
  readonly emphasis = input<QdsInlineIconButtonEmphasis>()

  /**
   * The size of the button and its icon.
   *
   * @default 'md'
   */
  readonly size = input<QdsInlineIconButtonSize>()

  /**
   * The style variant of the button's icon that controls its size
   *
   * @option `scale`: The icon size scales with the button's size
   * @option `fixed`: The icon size is constant, regardless of the button's size
   *
   * @default 'fixed'
   */
  readonly variant = input<QdsInlineIconButtonVariant | undefined>()

  protected readonly api = useInlineIconButtonApi({
    emphasis: this.emphasis,
    size: this.size,
    variant: this.variant,
  })

  readonly trackBindings = useTrackBindings(() => this.api().getRootBindings())

  ngOnInit() {
    this.trackBindings()
  }
}
