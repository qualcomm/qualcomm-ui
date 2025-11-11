import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {qdsTableApi} from "./qds-table-api"

@Directive({
  selector: "[q-table-header]",
  standalone: false,
})
export class TableHeaderDirective implements OnInit {
  protected readonly trackBindings = useTrackBindings(() => {
    return qdsTableApi.getHeaderBindings()
  })

  ngOnInit() {
    this.trackBindings()
  }
}
