import {booleanAttribute, Directive, input, output} from "@angular/core"

import {numberAttributeOrUndefined} from "@qualcomm-ui/angular-core/attributes"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {type ProgressApiProps} from "@qualcomm-ui/core/progress"
import type {Booleanish, NumberInput} from "@qualcomm-ui/utils/coercion"
import type {Direction} from "@qualcomm-ui/utils/direction"

@Directive()
export class CoreBaseProgressDirective
  implements SignalifyInput<Omit<ProgressApiProps, "ids">>
{
  /**
   * The initial value of the progress when it is first rendered. Use when you do
   * not need to control the state of the progress.
   */
  readonly defaultValue = input<number | undefined, NumberInput>(undefined, {
    transform: numberAttributeOrUndefined,
  })

  /**
   * The document's text/writing direction.
   *
   * @default "ltr"
   */
  readonly dir = input<Direction | undefined>()

  /**
   * If `true`, the progress is marked as invalid.
   */
  readonly invalid = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Maximum value
   *
   * @default 100
   */
  readonly max = input<number | undefined, NumberInput>(undefined, {
    transform: numberAttributeOrUndefined,
  })

  /**
   * Minimum value
   *
   * @default 0
   */
  readonly min = input<number | undefined, NumberInput>(undefined, {
    transform: numberAttributeOrUndefined,
  })

  /**
   * Current progress value (0-100)
   */
  readonly value = input<number | undefined, NumberInput>(undefined, {
    transform: numberAttributeOrUndefined,
  })

  /**
   * Callback fired when the value changes.
   */
  readonly valueChanged = output<number | undefined>()
}
