import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useSwitchContext} from "./switch-context.service"

@Directive()
export class CoreSwitchControlDirective implements OnInit {
  protected readonly switchContext = useSwitchContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.switchContext().getControlBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
