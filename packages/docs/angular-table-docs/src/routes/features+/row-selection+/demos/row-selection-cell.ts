import {Component} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {CheckboxModule} from "@qualcomm-ui/angular/checkbox"
import {CellComponentContextDirective} from "@qualcomm-ui/angular/table"

import type {User} from "./data"

@Component({
  imports: [CheckboxModule, FormsModule],
  selector: "app-row-selection-cell",
  template: `
    <label
      q-checkbox
      size="sm"
      [indeterminate]="context().row.getIsSomeSelected()"
      [ngModel]="
        context().row.getIsSelected() && !context().row.getIsSomeSelected()
      "
      (ngModelChange)="context().row.toggleSelected($event)"
    >
      <input
        q-checkbox-hidden-input
        [aria-label]="'Toggle ' + context().row.id + 'selection'"
      />
    </label>
  `,
})
export class RowSelectionCell extends CellComponentContextDirective<User> {}
