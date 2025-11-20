// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CorePaginationPageMetadataDirective} from "@qualcomm-ui/angular-core/pagination"

import {useQdsPaginationContext} from "./qds-pagination-context.service"

@Directive({
  selector: "[q-pagination-page-metadata]",
  standalone: false,
})
export class PaginationPageMetadataDirective extends CorePaginationPageMetadataDirective {
  protected readonly qdsPaginationContext = useQdsPaginationContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsPaginationContext().getPageMetadataBindings()),
    )
  }
}
