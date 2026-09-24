import {Component, inject} from "@angular/core"
import {LucideArrowDown, LucideArrowUp, LucideX} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {
  CellComponentContextDirective,
  TableModule,
} from "@qualcomm-ui/angular/table"

import type {User} from "./data"
import {RowPinningService} from "./row-pinning.service"

export interface RowPinningMeta {
  includeLeafRows: () => boolean
  includeParentRows: () => boolean
}

@Component({
  imports: [TableModule],
  providers: [provideIcons({LucideArrowDown, LucideArrowUp, LucideX})],
  selector: "app-pin-cell",
  template: `
    @if (context().row.getIsPinned()) {
      <button
        icon="X"
        q-table-cell-action
        (click)="
          context().row.pin(
            false,
            rowPinningService.includeLeafRows(),
            rowPinningService.includeParentRows()
          )
        "
      ></button>
    } @else {
      <div class="flex gap-1">
        <button
          icon="ArrowUp"
          q-table-cell-action
          (click)="
            context().row.pin(
              'top',
              rowPinningService.includeLeafRows(),
              rowPinningService.includeParentRows()
            )
          "
        ></button>
        <button
          icon="ArrowDown"
          q-table-cell-action
          (click)="
            context().row.pin(
              'bottom',
              rowPinningService.includeLeafRows(),
              rowPinningService.includeParentRows()
            )
          "
        ></button>
      </div>
    }
  `,
})
export class PinCell extends CellComponentContextDirective<
  User,
  unknown,
  RowPinningMeta
> {
  protected readonly rowPinningService = inject(RowPinningService)
}
