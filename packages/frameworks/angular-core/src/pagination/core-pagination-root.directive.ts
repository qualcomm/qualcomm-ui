// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  computed,
  Directive,
  inject,
  Injector,
  input,
  numberAttribute,
  type OnInit,
  output,
} from "@angular/core"

import {numberAttributeOrUndefined} from "@qualcomm-ui/angular-core/attributes"
import {
  normalizeProps,
  useMachine,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createPaginationApi,
  type PaginationApiProps,
  paginationMachine,
} from "@qualcomm-ui/core/pagination"
import type {NumberInput} from "@qualcomm-ui/utils/coercion"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {PaginationContextService} from "./pagination-context.service"

@Directive()
export class CorePaginationRootDirective
  implements SignalifyInput<PaginationApiProps>, OnInit
{
  /**
   * Number of always visible pages at the beginning and end.
   *
   * @default 1
   */
  readonly boundaryCount = input<number | undefined, NumberInput>(undefined, {
    transform: numberAttributeOrUndefined,
  })

  /**
   * The total number of records.
   *
   * @default 1
   */
  readonly count = input.required<number, NumberInput>({
    transform: numberAttribute,
  })

  /**
   * The page selected by default.
   *
   * @default 1
   */
  readonly defaultPage = input<number | undefined, NumberInput>(undefined, {
    transform: numberAttributeOrUndefined,
  })

  /**
   * The default number of data items to show per page.
   *
   * @default 1
   */
  readonly defaultPageSize = input<number | undefined, NumberInput>(undefined, {
    transform: numberAttributeOrUndefined,
  })

  /**
   * aria-label for the next-page button
   *
   * @default 'Go to next page'
   */
  readonly nextPageAriaLabel = input<string>("Go to next page")

  /**
   * Override the default aria-label for each page button.
   *
   * @default (page: number) => `Go to page ${page}`
   */
  readonly pageAriaLabel = input<(page: number) => string>(
    (page: number) => `Go to page ${page}`,
  )

  /**
   * aria-label for the prev-page button
   *
   * @default 'Go to previous page'
   */
  readonly prevPageAriaLabel = input<string>("Go to previous page")

  /**
   * The current page (controlled).
   */
  readonly page = input<number | undefined, NumberInput>(undefined, {
    transform: numberAttributeOrUndefined,
  })

  /**
   * The number of items to show per page.
   *
   * @default 1
   */
  readonly pageSize = input<number | undefined, NumberInput>(undefined, {
    transform: numberAttributeOrUndefined,
  })

  /**
   * Number of always visible pages before and after the current page.
   *
   * @default 1
   */
  readonly siblingCount = input<number | undefined, NumberInput>(undefined, {
    transform: numberAttributeOrUndefined,
  })

  /**
   * Callback fired when the page value changes.
   */
  readonly pageChanged = output<number>()

  /**
   * Callback fired when the page size changes.
   */
  readonly pageSizeChanged = output<number>()

  protected readonly trackBindings = useTrackBindings(() =>
    this.paginationContext.context().getRootBindings(),
  )

  private readonly paginationContext = inject(PaginationContextService)

  private readonly injector = inject(Injector)

  ngOnInit() {
    const machine = useMachine(
      paginationMachine,
      computed<Explicit<PaginationApiProps>>(() => ({
        boundaryCount: this.boundaryCount(),
        count: this.count(),
        defaultPage: this.defaultPage(),
        defaultPageSize: this.defaultPageSize(),
        nextPageAriaLabel: this.nextPageAriaLabel(),
        onPageChange: (page) => {
          this.pageChanged.emit(page)
        },
        onPageSizeChange: (pageSize) => {
          this.pageSizeChanged.emit(pageSize)
        },
        page: this.page(),
        pageAriaLabel: this.pageAriaLabel(),
        pageSize: this.pageSize(),
        prevPageAriaLabel: this.prevPageAriaLabel(),
        siblingCount: this.siblingCount(),
      })),
      this.injector,
    )

    this.paginationContext.init(
      computed(() => createPaginationApi(machine, normalizeProps)),
    )

    this.trackBindings()
  }
}
