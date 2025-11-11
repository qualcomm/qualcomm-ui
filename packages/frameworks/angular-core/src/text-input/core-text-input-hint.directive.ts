import {computed, Directive, input, type OnInit} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useTextInputContext} from "./text-input-context.service"

@Directive()
export class CoreTextInputHintDirective implements OnInit {
  readonly id = input<string>()

  protected readonly textInputContext = useTextInputContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.textInputContext().getHintBindings({
      id: this.hostId(),
      onDestroy: this.onDestroy,
    }),
  )

  private readonly hostId = computed(() => useId(this, this.id()))

  private readonly onDestroy = useOnDestroy()

  ngOnInit() {
    this.trackBindings()
  }
}
