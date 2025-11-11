import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {qdsTableApi} from "./qds-table-api"

@Directive({
  selector: "[q-table-row-drag-preview]",
  standalone: false,
})
export class TableRowDragPreviewDirective implements OnInit {
  protected readonly trackBindings = useTrackBindings(() => {
    return qdsTableApi.getRowDragPreviewBindings()
  })

  ngOnInit() {
    this.trackBindings()
  }
}
