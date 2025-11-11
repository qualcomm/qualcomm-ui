import {Component, input, type OnInit} from "@angular/core"
import {GripVertical} from "lucide-angular"

import {useInlineIconButtonApi} from "@qualcomm-ui/angular/inline-icon-button"
import {
  type LucideIconOrString,
  provideIcons,
} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-api"

@Component({
  providers: [provideIcons({GripVertical})],
  selector: "[q-table-column-drag-handle]",
  standalone: false,
  template: `
    <svg
      [q-bind]="inlineIconButtonApi().getIconBindings()"
      [qIcon]="icon()"
    ></svg>
  `,
})
export class TableColumnDragHandleDirective implements OnInit {
  /**
   * Lucide icon to display inside the button.
   *
   * @default "GripVertical"
   */
  readonly icon = input<LucideIconOrString>("GripVertical")

  protected readonly inlineIconButtonApi = useInlineIconButtonApi({
    emphasis: "neutral",
    size: "sm",
    variant: "fixed",
  })

  protected readonly trackBindings = useTrackBindings(() =>
    mergeProps(
      this.inlineIconButtonApi().getRootBindings(),
      qdsTableApi.getDragHandleBindings(),
    ),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
