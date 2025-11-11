import {Component, input, type OnInit} from "@angular/core"
import {ChevronRight} from "lucide-angular"

import {useInlineIconButtonApi} from "@qualcomm-ui/angular/inline-icon-button"
import {type LucideIconOrString, provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {Row} from "@qualcomm-ui/core/table"
import type {QdsTableRowExpandButtonProps} from "@qualcomm-ui/qds-core/table"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-api"

@Component({
  providers: [provideIcons({ChevronRight})],
  selector: "[q-table-row-expand-button]",
  standalone: false,
  template: `
    <svg
      [q-bind]="inlineIconButtonApi().getIconBindings()"
      [qIcon]="icon()"
    ></svg>
  `,
})
export class TableRowExpandButtonDirective
  implements OnInit, SignalifyInput<QdsTableRowExpandButtonProps>
{
  /**
   * The row associated with the expand button.
   */
  readonly row = input.required<Row<any>>()

  /**
   * Lucide icon to display inside the button.
   *
   * @default "ChevronRight"
   */
  readonly icon = input<LucideIconOrString>("ChevronRight")

  protected readonly inlineIconButtonApi = useInlineIconButtonApi({
    emphasis: "neutral",
    size: "sm",
    variant: "fixed",
  })

  protected readonly trackBindings = useTrackBindings(() =>
    mergeProps(
      this.inlineIconButtonApi().getRootBindings(),
      qdsTableApi.getRowExpandButtonBindings({
        row: this.row(),
      }),
    ),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
