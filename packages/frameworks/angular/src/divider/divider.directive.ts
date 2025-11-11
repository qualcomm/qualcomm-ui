import {computed, Directive, input, type OnInit} from "@angular/core"

import {normalizeProps, useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createQdsDividerApi,
  dividerClasses,
  type QdsDividerApiProps,
  type QdsDividerOrientation,
  type QdsDividerVariant,
} from "@qualcomm-ui/qds-core/divider"
import type {Explicit} from "@qualcomm-ui/utils/guard"

@Directive({
  host: {
    "[class]": "dividerClasses.root",
  },
  selector: "[q-divider]",
})
export class DividerDirective
  implements SignalifyInput<QdsDividerApiProps>, OnInit
{
  /**
   * Controls whether the divider renders horizontally or vertically.
   *
   * @default 'horizontal'
   */
  readonly orientation = input<QdsDividerOrientation | undefined>(undefined)

  /**
   * Visual emphasis level of the divider.
   * @option `subtle`: Low contrast, less visually prominent
   * @option `normal`: Standard appearance with balanced visibility
   * @option `strong`: High contrast, maximum visual separation
   *
   * @default 'normal'
   */
  readonly variant = input<QdsDividerVariant | undefined>(undefined)

  protected readonly dividerClasses = dividerClasses

  readonly dividerApi = computed(() => {
    const props: Explicit<QdsDividerApiProps> = {
      orientation: this.orientation(),
      variant: this.variant(),
    }
    return createQdsDividerApi(props, normalizeProps)
  })

  protected readonly trackBindings = useTrackBindings(() =>
    this.dividerApi().getRootBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
