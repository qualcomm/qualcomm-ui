import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useProgressRingContext} from "./progress-ring-context.service"

@Directive()
export class CoreProgressRingBarDirective implements OnInit {
  protected readonly progressRingContext = useProgressRingContext()

  protected readonly trackBindings = useTrackBindings(() => {
    return this.progressRingContext().getRingBarBindings()
  })

  ngOnInit() {
    this.trackBindings()
  }
}
