import {Directive, ElementRef, inject, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {qdsTableApi} from "./qds-table-api"

@Directive({
  selector: "[q-table-column-drag-preview]",
  standalone: false,
})
export class TableColumnDragPreviewDirective implements OnInit {
  protected readonly trackBindings = useTrackBindings(() => {
    return qdsTableApi.getColumnDragPreviewBindings()
  })

  protected readonly elementRef = inject(ElementRef)

  ngOnInit() {
    this.trackBindings()
  }
}
