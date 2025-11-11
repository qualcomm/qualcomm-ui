import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useNumberInputContext} from "./number-input-context.service"

@Directive()
export class CoreNumberInputErrorIndicatorDirective implements OnInit {
  protected readonly numberInputContext = useNumberInputContext()

  protected readonly trackBindings = useTrackBindings(() => {
    return this.numberInputContext().getErrorIndicatorBindings()
  })

  ngOnInit() {
    this.trackBindings()
  }
}
