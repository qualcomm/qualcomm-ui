// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input} from "@angular/core"
import {ChevronLeft} from "lucide-angular"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {CorePaginationPrevTriggerDirective} from "@qualcomm-ui/angular-core/pagination"
import {paginationClasses} from "@qualcomm-ui/qds-core/pagination"

@Component({
  host: {
    "[class]": "paginationClasses.pageItem",
  },
  selector: "[q-pagination-prev-trigger]",
  standalone: false,
  template: `
    <svg [qIcon]="icon()" />
  `,
})
export class PaginationPrevTriggerComponent extends CorePaginationPrevTriggerDirective {
  /**
   * lucide-angular icon.
   *
   * @default ChevronLeft
   */
  readonly icon = input<LucideIconOrString>(ChevronLeft)

  protected readonly paginationClasses = paginationClasses
}
