// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  computed,
  Directive,
  effect,
  inject,
  TemplateRef,
  ViewContainerRef,
} from "@angular/core"

import type {FilterState} from "@qualcomm-ui/core/filter-set"

import {FilterContextService} from "./filter-context.service"

export interface FilterContextTemplateContext {
  $implicit: FilterState
  filterContext: FilterState
}

/**
 * Renders its template with the state of the surrounding filter, such as its
 * resolved label, count, and value. Renders nothing when the filter has no
 * definition.
 *
 * @example
 * ```angular-html
 * <span q-filter-panel-filter-label *filterContext="let filter">
 *   {{ filter.label }} ({{ filter.count }})
 * </span>
 * ```
 */
@Directive({
  selector: "[filterContext]",
})
export class FilterContextDirective {
  private readonly contextService = inject(FilterContextService, {
    optional: true,
  })
  private readonly templateRef =
    inject<TemplateRef<FilterContextTemplateContext>>(TemplateRef)
  private readonly viewContainerRef = inject(ViewContainerRef)

  /**
   * Only the presence of the state is tracked, so that state changes update the
   * rendered view instead of rebuilding it.
   */
  private readonly hasState = computed(
    () =>
      !!this.contextService?.initialized() && !!this.contextService.context(),
  )

  constructor() {
    const contextService = this.contextService
    if (!contextService) {
      console.warn(
        "filterContext used without a parent filter. Template will not render.",
      )
      return
    }

    const viewContext: FilterContextTemplateContext = {
      get $implicit() {
        return contextService.context()!
      },
      get filterContext() {
        return contextService.context()!
      },
    }

    effect((onCleanup) => {
      if (!this.hasState()) {
        return
      }
      const view = this.viewContainerRef.createEmbeddedView(
        this.templateRef,
        viewContext,
      )
      onCleanup(() => view.destroy())
    })
  }

  /**
   * Type guard for the context, provides intellisense for the context in the
   * template.
   */
  static ngTemplateContextGuard(
    _dir: FilterContextDirective,
    _ctx: unknown,
  ): _ctx is FilterContextTemplateContext {
    return true
  }
}
