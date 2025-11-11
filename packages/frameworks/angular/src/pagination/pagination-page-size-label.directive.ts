// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {CorePaginationPageSizeLabelDirective} from "@qualcomm-ui/angular-core/pagination"
import {paginationClasses} from "@qualcomm-ui/qds-core/pagination"

@Directive({
  host: {
    "[class]": "paginationClasses.pageSizeLabel",
  },
  selector: "[q-pagination-page-size-label]",
  standalone: false,
})
export class PaginationPageSizeLabelDirective extends CorePaginationPageSizeLabelDirective {
  protected readonly paginationClasses = paginationClasses
}
