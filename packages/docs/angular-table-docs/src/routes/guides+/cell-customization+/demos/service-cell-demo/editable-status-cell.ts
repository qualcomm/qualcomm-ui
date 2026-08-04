import {Component, computed, inject} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {SelectModule} from "@qualcomm-ui/angular/select"
import {CellComponentContextDirective} from "@qualcomm-ui/angular/table"
import {selectCollection} from "@qualcomm-ui/core/select"

import {type User, UserDataService} from "./user-data.service"

@Component({
  imports: [SelectModule, FormsModule],
  selector: "app-editable-status-cell",
  template: `
    <q-select
      aria-label="Test select"
      clearable="false"
      size="sm"
      [collection]="collection"
      [ngModel]="value()"
      (ngModelChange)="updateStatus($event)"
    />
  `,
})
export class EditableStatusCell extends CellComponentContextDirective<
  User,
  string
> {
  private readonly userDataService = inject(UserDataService)

  readonly value = computed(() => [this.context().getValue()])

  readonly collection = selectCollection({
    items: ["active", "suspended", "pending"],
  })

  updateStatus(value: string[]) {
    this.userDataService.updateStatus(this.context().row.index, value[0])
  }
}
