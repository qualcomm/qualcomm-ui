import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {usePasswordInputContext} from "./password-input-context.service"

@Directive()
export class CorePasswordInputInputGroupDirective implements OnInit {
  protected readonly passwordInputContext = usePasswordInputContext()

  protected readonly trackBindings = useTrackBindings(() => {
    return this.passwordInputContext().getInputGroupBindings()
  })

  ngOnInit() {
    this.trackBindings()
  }
}
