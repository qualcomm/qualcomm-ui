import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useTextInputContext} from "./text-input-context.service"

@Directive()
export class CoreTextInputErrorIndicatorDirective implements OnInit {
  protected readonly textInputContext = useTextInputContext()

  protected readonly trackBindings = useTrackBindings(() => {
    return this.textInputContext().getErrorIndicatorBindings()
  })

  ngOnInit() {
    this.trackBindings()
  }
}
