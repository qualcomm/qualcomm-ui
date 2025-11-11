import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useProgressContext} from "./progress-context.service"

@Directive()
export class CoreProgressValueTextDirective implements OnInit {
  protected readonly progressContext = useProgressContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.progressContext().getValueTextBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
