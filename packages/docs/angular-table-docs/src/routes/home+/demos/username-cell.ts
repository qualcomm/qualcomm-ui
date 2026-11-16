import {Component} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {CheckboxModule} from "@qualcomm-ui/angular/checkbox"
import {
  CellComponentContextDirective,
  TableModule,
} from "@qualcomm-ui/angular/table"

import type {User} from "./data"

@Component({
  imports: [CheckboxModule, FormsModule, TableModule],
  selector: "app-username-cell",
  template: `
    @let row = context().row;
    <div
      class="inline-flex h-full items-center gap-2"
      [style.padding-left.rem]="row.depth * 2"
    >
      <label
        q-checkbox
        size="sm"
        [indeterminate]="row.getIsSomeSelected()"
        [ngModel]="row.getIsSelected()"
        (ngModelChange)="row.toggleSelected($event)"
      >
        <input
          q-checkbox-hidden-input
          [aria-label]="row.getIsSelected() ? 'Deselect row' : 'Select row'"
        />
      </label>
      @if (row.getCanExpand()) {
        <button
          q-table-row-expand-button
          [isExpanded]="row.getIsExpanded()"
          [row]="row"
        ></button>
      }
      <span>{{ context().getValue() }}</span>
    </div>
  `,
})
export class UsernameCell extends CellComponentContextDirective<User> {}
