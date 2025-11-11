import {computed, Directive} from "@angular/core"

import {PaginationRootDirective} from "@qualcomm-ui/angular/pagination"

import {qdsTableApi} from "./qds-table-api"

@Directive({
  selector: "[q-table-pagination]",
  standalone: false,
})
export class TablePaginationDirective extends PaginationRootDirective {
  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => qdsTableApi.getPaginationBindings()),
    )
  }
}
