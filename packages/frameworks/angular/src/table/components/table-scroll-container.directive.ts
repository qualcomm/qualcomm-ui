import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {qdsTableApi} from "./qds-table-api"

@Directive({
  selector: "[q-table-scroll-container]",
  standalone: false,
})
export class TableScrollContainerDirective implements OnInit {
  protected readonly trackBindings = useTrackBindings(() => {
    return qdsTableApi.getScrollContainerBindings()
  })

  ngOnInit() {
    this.trackBindings()
  }
}
