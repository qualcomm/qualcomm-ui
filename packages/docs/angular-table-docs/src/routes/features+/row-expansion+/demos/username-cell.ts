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
  selector: "app-username-cell-1",
  template: `
    <div
      class="inline-flex h-full items-center gap-2"
      [style]="{
        paddingLeft: context().row.depth * 2 + 'rem',
      }"
    >
      <label
        q-checkbox
        size="sm"
        [indeterminate]="context().row.getIsSomeSelected()"
        [ngModel]="context().row.getIsSelected()"
        (ngModelChange)="context().row.toggleSelected($event)"
      >
        <input
          q-checkbox-hidden-input
          [aria-label]="'Toggle ' + context().column.id + ' expanded'"
        />
      </label>

      @if (context().row.getCanExpand()) {
        <div class="inline-flex items-center justify-center">
          <button
            q-table-row-expand-button
            [isExpanded]="context().row.getIsExpanded()"
            [row]="context().row"
          ></button>
        </div>
      }
      <span>{{ context().getValue() }}</span>
    </div>
  `,
})
export class UsernameCell extends CellComponentContextDirective<User> {}
