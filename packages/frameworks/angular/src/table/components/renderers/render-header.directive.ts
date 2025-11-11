// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

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
  selector: "[renderHeader]",
  standalone: false,
})
export class RenderHeaderDirective implements OnDestroy {
  private readonly templateRef = inject(TemplateRef)
  private readonly viewContainerRef = inject(ViewContainerRef)

  /**
   * The header data model.
   */
  readonly renderHeader = input.required<Header<any, any>>()

  constructor() {
    effect(() => {
      this.renderHeader()
      this.render()
    })
  }

  ngOnDestroy() {
    this.viewContainerRef.clear()
  }

  private render() {
    this.viewContainerRef.clear()

    const header = this.renderHeader()
    const valueOrFn = header.column.columnDef.header

    if (typeof valueOrFn === "function") {
      const result = valueOrFn(header.getContext())

      if (typeof result === "function") {
        const componentRef = this.viewContainerRef.createComponent(result)
        componentRef.setInput("context", header.getContext())
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
