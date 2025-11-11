import {booleanAttribute, Directive, input, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  type QdsTableApiProps,
  type QdsTableSize,
} from "@qualcomm-ui/qds-core/table"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {qdsTableApi} from "./qds-table-api"

@Directive({
  selector: "[q-table-root]",
  standalone: false,
})
export class TableRootDirective
  implements OnInit, SignalifyInput<QdsTableApiProps>
{
  /**
   * Whether to show column dividers
   */
  readonly showColumnDivider = input<boolean | undefined, Booleanish>(
    undefined,
    {
      transform: booleanAttribute,
    },
  )

  /**
   * Governs the size and padding of table elements and text.
   *
   * @default 'md'
   */
  readonly size = input<QdsTableSize>()

  protected readonly trackBindings = useTrackBindings(() =>
    qdsTableApi.getRootBindings({
      showColumnDivider: this.showColumnDivider(),
      size: this.size(),
    }),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
