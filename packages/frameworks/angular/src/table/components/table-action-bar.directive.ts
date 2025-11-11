import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {qdsTableApi} from "./qds-table-api"

@Directive({
  selector: "[q-table-action-bar]",
  standalone: false,
})
export class TableActionBarDirective implements OnInit {
  protected readonly trackBindings = useTrackBindings(() => {
    return qdsTableApi.getActionBarBindings()
  })

  ngOnInit() {
    this.trackBindings()
  }
}
