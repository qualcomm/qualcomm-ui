import {
  Directive,
  effect,
  inject,
  Injector,
  TemplateRef,
  ViewContainerRef,
} from "@angular/core"

import {BaseApiContextService} from "./api-context.service"

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

    effect(
      () => {
        this.viewContainerRef.clear()
        const apiInstance = contextService.context()

        if (apiInstance) {
          this.viewContainerRef.createEmbeddedView(this.templateRef, {
            $implicit: apiInstance,
            [contextName]: apiInstance,
          })
        }
      },
      {injector: this.injector},
    )
  }
}
