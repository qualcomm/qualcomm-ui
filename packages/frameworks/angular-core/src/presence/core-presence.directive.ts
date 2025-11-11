import {booleanAttribute, Directive, input, output} from "@angular/core"

import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {PresenceApiProps} from "@qualcomm-ui/core/presence"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

@Directive()
export class CorePresenceDirective implements SignalifyInput<PresenceApiProps> {
  /**
   * Whether to synchronize the present change immediately or defer it to the next
   * frame.
   *
   * @default false
   */
  readonly immediate = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

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
   * The controlled presence of the node.
   */
  readonly present = input<boolean | undefined>(undefined)

  /**
   * Whether to allow the initial presence animation.
   *
   * @default false
   */
  readonly skipAnimationOnMount = input<boolean | undefined, Booleanish>(
    undefined,
    {transform: booleanAttribute},
  )

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
   * Function called when the animation ends in the closed state
   */
  exitCompleted = output<void>()
}
