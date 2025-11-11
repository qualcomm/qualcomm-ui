// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {
  CorePaginationRootDirective,
  providePaginationContext,
} from "@qualcomm-ui/angular-core/pagination"
import {paginationClasses} from "@qualcomm-ui/qds-core/pagination"

@Directive({
  host: {
    "[class]": "paginationClasses.root",
  },
  providers: [providePaginationContext()],
  selector: "[q-pagination-root]",
  standalone: false,
})
export class PaginationRootDirective extends CorePaginationRootDirective {
  protected readonly paginationClasses = paginationClasses
}
