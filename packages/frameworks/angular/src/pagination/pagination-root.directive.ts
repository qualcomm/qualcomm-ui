// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input, type OnInit} from "@angular/core"

import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {
  CorePaginationRootDirective,
  providePaginationContext,
} from "@qualcomm-ui/angular-core/pagination"
import {
  createQdsPaginationApi,
  type QdsPaginationSize,
} from "@qualcomm-ui/qds-core/pagination"

import {
  provideQdsPaginationContext,
  QdsPaginationContextService,
} from "./qds-pagination-context.service"

@Directive({
  providers: [providePaginationContext(), provideQdsPaginationContext()],
  selector: "[q-pagination-root]",
  standalone: false,
})
export class PaginationRootDirective
  extends CorePaginationRootDirective
  implements OnInit
{
  /**
   * Governs the size and padding of pagination elements.
   *
   * @default 'sm'
   */
  readonly size = input<QdsPaginationSize>()

  protected readonly paginationService = inject(QdsPaginationContextService)

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.paginationService.context().getRootBindings()),
    )
  }

  override ngOnInit() {
    super.ngOnInit()

    this.paginationService.init(
      computed(() =>
        createQdsPaginationApi(
          {
            size: this.size(),
          },
          normalizeProps,
        ),
      ),
    )
  }
}
