import {
  Directive,
  effect,
  inject,
  input,
  type OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from "@angular/core"

import type {Header} from "@qualcomm-ui/core/table"

@Directive({
  selector: "[renderFooter]",
  standalone: false,
})
export class RenderFooterDirective implements OnDestroy {
  private readonly templateRef = inject(TemplateRef)
  private readonly viewContainerRef = inject(ViewContainerRef)

  /**
   * The footer data model.
   */
  readonly renderFooter = input.required<Header<any, any>>()

  constructor() {
    effect(() => {
      this.renderFooter()
      this.render()
    })
  }

  ngOnDestroy() {
    this.viewContainerRef.clear()
  }

  private render() {
    this.viewContainerRef.clear()

    const footer = this.renderFooter()
    const valueOrFn = footer.column.columnDef.footer

    if (typeof valueOrFn === "function") {
      const result = valueOrFn(footer.getContext())

      if (typeof result === "function") {
        const componentRef = this.viewContainerRef.createComponent(result)
        componentRef.setInput("context", footer.getContext())
      } else {
        this.viewContainerRef.createEmbeddedView(this.templateRef, {
          $implicit: result,
        })
      }
    } else {
      this.viewContainerRef.createEmbeddedView(this.templateRef, {
        $implicit: valueOrFn,
      })
    }
  }
}
