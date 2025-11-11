import {Component, input, type OnInit} from "@angular/core"

import {useInlineIconButtonApi} from "@qualcomm-ui/angular/inline-icon-button"
import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-api"

@Component({
  selector: "[q-table-column-header-action]",
  standalone: false,
  template: `
    <svg
      [q-bind]="inlineIconButtonApi().getIconBindings()"
      [qIcon]="icon()"
    ></svg>
  `,
})
export class TableColumnHeaderActionDirective implements OnInit {
  /**
   * Lucide icon to display inside the button.
   */
  readonly icon = input.required<LucideIconOrString>()

  protected readonly inlineIconButtonApi = useInlineIconButtonApi({
    emphasis: "neutral",
    size: "sm",
    variant: "fixed",
  })

  protected readonly trackBindings = useTrackBindings(() =>
    mergeProps(
      this.inlineIconButtonApi().getRootBindings(),
      qdsTableApi.getColumnHeaderActionBindings(),
    ),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
