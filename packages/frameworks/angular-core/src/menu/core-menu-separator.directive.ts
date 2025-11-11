import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useMenuContext} from "./menu-context.service"

@Directive()
export class CoreMenuSeparatorDirective implements OnInit {
  protected readonly menuContext = useMenuContext()

  protected readonly trackBindings = useTrackBindings(() => {
    return this.menuContext().getSeparatorBindings()
  })

  ngOnInit() {
    this.trackBindings()
  }
}
