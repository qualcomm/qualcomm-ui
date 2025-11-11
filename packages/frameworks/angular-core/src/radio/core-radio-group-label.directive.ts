import {computed, Directive, input, type OnInit} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"

import {useRadioContext} from "./radio-context.service"

@Directive()
export class CoreRadioGroupLabelDirective
  implements OnInit, SignalifyInput<{id?: string}>
{
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.)
   */
  readonly id = input<string>()

  protected readonly radioContext = useRadioContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.radioContext().getLabelBindings({
      id: this.hostId(),
      onDestroy: this.onDestroy,
    }),
  )

  protected readonly onDestroy = useOnDestroy()
  private readonly hostId = computed(() => useId(this, this.id()))

  ngOnInit() {
    this.trackBindings()
  }
}
