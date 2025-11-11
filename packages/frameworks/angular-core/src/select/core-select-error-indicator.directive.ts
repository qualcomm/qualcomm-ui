import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useSelectContext} from "./select-context.service"

@Directive()
export class CoreSelectErrorIndicatorDirective implements OnInit {
  protected readonly selectContext = useSelectContext()

  protected readonly trackBindings = useTrackBindings(() => {
    return this.selectContext().getErrorIndicatorBindings()
  })

  ngOnInit() {
    this.trackBindings()
  }
}
