import {Component, computed, input, type OnInit} from "@angular/core"
import {ArrowDownUp, ArrowUp} from "lucide-angular"

import {useInlineIconButtonApi} from "@qualcomm-ui/angular/inline-icon-button"
import {
  type LucideIconOrString,
  provideIcons,
} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {Header} from "@qualcomm-ui/core/table"
import type {QdsTableColumnSortActionProps} from "@qualcomm-ui/qds-core/table"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-api"

@Component({
  providers: [provideIcons({ArrowDownUp, ArrowUp})],
  selector: "[q-table-column-sort-action]",
  standalone: false,
  template: `
    @if (canSort()) {
      <svg
        [q-bind]="inlineIconButtonApi().getIconBindings()"
        [qIcon]="sortIcon()"
      ></svg>
    }
  `,
})
export class TableColumnSortActionDirective
  implements OnInit, SignalifyInput<QdsTableColumnSortActionProps>
{
  /**
   * The column header associated with the sort action.
   */
  readonly header = input.required<Header<any>>()

  protected readonly canSort = computed(() => this.header().column.getCanSort())

  protected readonly sortIcon = computed((): LucideIconOrString => {
    const sortDirection = this.header().column.getIsSorted()
    return sortDirection ? "ArrowUp" : "ArrowDownUp"
  })

  protected readonly inlineIconButtonApi = useInlineIconButtonApi({
    emphasis: "neutral",
    size: "sm",
    variant: "fixed",
  })

  protected readonly trackBindings = useTrackBindings(() =>
    mergeProps(
      this.inlineIconButtonApi().getRootBindings(),
      qdsTableApi.getColumnSortActionBindings({
        header: this.header(),
      }),
    ),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
