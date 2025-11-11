import {Component, computed, inject} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {SelectModule} from "@qualcomm-ui/angular/select"
import {CellComponentContextDirective} from "@qualcomm-ui/angular/table"
import {selectCollection} from "@qualcomm-ui/core/select"

import type {User} from "./data"
import {MutableDataService} from "./mutable-data.service"

@Component({
  imports: [SelectModule, FormsModule],
  selector: "account-status-cell",
  template: `
    <q-select
      aria-label="Account Status"
      clearable="false"
      size="sm"
      [collection]="collection"
      [ngModel]="value()"
      (ngModelChange)="updateValue($event)"
    />
  `,
})
export class AccountStatusCell extends CellComponentContextDirective<
  User,
  string
> {
  readonly dataService = inject(MutableDataService)

  readonly value = computed(() => {
    const value = this.context().getValue()
    return [value]
  })

  updateValue(value: string[]) {
    this.dataService.updateColumnValue(
      this.context().row.index,
      this.context().column.id,
      value[0],
    )
  }

  readonly collection = selectCollection({
    items: ["active", "suspended", "pending"],
  })
}
