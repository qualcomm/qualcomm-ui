import {computed, Directive, input, type OnInit} from "@angular/core"

import {useCheckboxContext} from "@qualcomm-ui/angular-core/checkbox"
import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"

@Directive()
export class CoreSegmentedControlHiddenInputDirective
  implements OnInit, SignalifyInput<{id?: string}>
{
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.)
   */
  readonly id = input<string>()

  protected readonly onDestroy = useOnDestroy()

  private readonly hostId = computed(() => useId(this, this.id()))

  protected readonly context = useCheckboxContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.context().getHiddenInputBindings({
      id: this.hostId(),
    }),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
