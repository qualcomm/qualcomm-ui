// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input} from "@angular/core"
import {ChevronRight} from "lucide-angular"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {CorePaginationNextTriggerDirective} from "@qualcomm-ui/angular-core/pagination"
import {paginationClasses} from "@qualcomm-ui/qds-core/pagination"

@Component({
  host: {
    "[class]": "paginationClasses.pageItem",
  },
  selector: "[q-pagination-next-trigger]",
  standalone: false,
  template: `
    <svg [qIcon]="icon()" />
  `,
})
export class PaginationNextTriggerComponent extends CorePaginationNextTriggerDirective {
  /**
   * lucide-angular icon.
   *
   * @default ChevronRight
   */
  readonly icon = input<LucideIconOrString>(ChevronRight)

  protected readonly paginationClasses = paginationClasses
}
