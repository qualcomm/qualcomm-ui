// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {Ellipsis} from "lucide-angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {CorePaginationPageItemDirective} from "@qualcomm-ui/angular-core/pagination"
import {paginationClasses} from "@qualcomm-ui/qds-core/pagination"

@Component({
  host: {
    "[class]": "paginationClasses.pageItem",
  },
  providers: [provideIcons({Ellipsis})],
  selector: "[q-pagination-page-item]",
  standalone: false,
  template: `
    @if (pageItemType() === "page") {
      <ng-container>{{ page() }}</ng-container>
    } @else {
      <svg qIcon="Ellipsis" />
    }
  `,
})
export class PaginationPageItemComponent extends CorePaginationPageItemDirective {
  readonly pageItemType = computed(() => this.itemProps()["data-type"])

  readonly page = computed(() => {
    const props = this.itemProps()
    return props["data-type"] === "page" ? props["data-page"] : undefined
  })

  protected readonly paginationClasses = paginationClasses
}
