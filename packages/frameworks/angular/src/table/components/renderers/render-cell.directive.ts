import {
  booleanAttribute,
  Directive,
  effect,
  inject,
  input,
  type OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from "@angular/core"

import type {Cell} from "@qualcomm-ui/core/table"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

@Directive({
  selector: "[renderCell]",
  standalone: false,
})
export class RenderCellDirective implements OnDestroy {
  private readonly templateRef = inject(TemplateRef)
  private readonly viewContainerRef = inject(ViewContainerRef)

  /**
   * The cell data model.
   */
  readonly renderCell = input.required<Cell<any, any>>()

  /**
   * Additional input properties to pass to the underlying column's cell. Only
   * applicable if the cell is a Component type.
   */
  readonly renderCellComponentInput = input<Record<string, any>>()

  /**
   * If `true`, the cell is aggregated.
   * TODO: link to aggregated cell docs.
   */
  readonly renderCellIsAggregated = input<boolean | undefined, Booleanish>(
    undefined,
    {
      transform: booleanAttribute,
    },
  )

  constructor() {
    effect(() => {
      this.renderCell()
      this.renderCellIsAggregated()
      this.renderCellComponentInput()

      this.render()
    })
  }

  ngOnDestroy() {
    this.viewContainerRef.clear()
  }

  private render() {
    this.viewContainerRef.clear()

    const cell = this.renderCell()

    if (cell.getIsPlaceholder()) {
      return
    }

    const valueOrFn = this.renderCellIsAggregated()
      ? (cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell)
      : cell.column.columnDef.cell

    if (typeof valueOrFn === "function") {
      const result = valueOrFn(cell.getContext())

      if (typeof result === "function") {
        const componentRef = this.viewContainerRef.createComponent(result)
        const inputs = {
          ...this.renderCellComponentInput(),
          context: cell.getContext(),
        }
        Object.entries(inputs).forEach(([key, value]) => {
          componentRef.setInput(key, value)
        })
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
