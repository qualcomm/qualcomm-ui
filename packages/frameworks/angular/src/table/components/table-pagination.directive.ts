// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {PaginationRootDirective} from "@qualcomm-ui/angular/pagination"
import {providePaginationContext} from "@qualcomm-ui/angular-core/pagination"

import {qdsTableApi} from "./qds-table-api"

@Directive({
  providers: [providePaginationContext()],
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
