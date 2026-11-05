// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  Directive,
  effect,
  inject,
  Injector,
  TemplateRef,
  ViewContainerRef,
} from "@angular/core"

import type {BaseApiContextService} from "./api-context.service"

/**
 * Base directive for creating context-aware directives that render content
 * only when an API context is available.
 *
 * This abstract class provides the core functionality to:
 * 1. Check if a required API context service is available
 * 2. Render the associated template only when the API instance is accessible
 * 3. Provide the API instance to the template as a typed value
 */
@Directive()
export abstract class ApiContextDirective<T extends object> {
  private readonly templateRef = inject<TemplateRef<any>>(TemplateRef)
  private readonly viewContainerRef = inject(ViewContainerRef)
  private readonly injector = inject(Injector)

  protected constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    contextService: BaseApiContextService<T>,
    contextName: string,
  ) {
    if (!contextService) {
      console.warn(
        `${contextName} used without a parent context. Template will not render.`,
      )
      return
    }

    /**
     * A getter, not a snapshot: tracking the read inside the view lets Angular
     * update on API change without destroying and rebuilding the DOM.
     */
    const viewContext = {
      get $implicit() {
        return contextService.context()
      },
      get [contextName]() {
        return contextService.context()
      },
    }

    effect(
      (onCleanup) => {
        if (!contextService.initialized()) {
          return
        }

        const view = this.viewContainerRef.createEmbeddedView(
          this.templateRef,
          viewContext,
        )
        onCleanup(() => view.destroy())
      },
      {injector: this.injector},
    )
  }
}
