import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {usePaginationContext} from "./pagination-context.service"

@Directive()
export class CorePaginationPrevTriggerDirective implements OnInit {
  readonly paginationContext = usePaginationContext()

  private readonly trackBindings = useTrackBindings(() =>
    this.paginationContext().getPrevTriggerBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
