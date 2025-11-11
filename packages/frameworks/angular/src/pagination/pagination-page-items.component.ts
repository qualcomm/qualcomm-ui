// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component} from "@angular/core"

import {CorePaginationPageItemsDirective} from "@qualcomm-ui/angular-core/pagination"

@Component({
  selector: "q-pagination-page-items",
  standalone: false,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  template: `
    @for (
      item of paginationContext().pageItems;
      track trackPageItem(item, idx);
      let idx = $index
    ) {
      <button q-pagination-page-item [item]="item"></button>
    }
    <ng-content />
  `,
})
export class PaginationPageItemsComponent extends CorePaginationPageItemsDirective {}
