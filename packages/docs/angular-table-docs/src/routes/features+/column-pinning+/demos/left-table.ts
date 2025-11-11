import {Component, input} from "@angular/core"

import {type AngularTable, TableModule} from "@qualcomm-ui/angular/table"

import type {User} from "./data"
import {PinnableHeader} from "./pinnable-header"

@Component({
  imports: [PinnableHeader, TableModule],
  selector: "left-table",
  template: `
    <div q-table-root>
      <div q-table-scroll-container>
        <table q-table-table>
          <thead q-table-header>
            @for (
              headerGroup of table().getLeftHeaderGroups();
              track headerGroup.id
            ) {
              <tr q-table-row>
                @for (header of headerGroup.headers; track header.id) {
                  <th
                    pinnable-header
                    q-table-header-cell
                    [header]="header"
                  ></th>
                }
              </tr>
            }
          </thead>
          <tbody q-table-body>
            @for (row of table().getRowModel().rows; track row.id) {
              <tr q-table-row>
                @for (cell of row.getLeftVisibleCells(); track cell.id) {
                  <td *renderCell="cell; let value" q-table-cell>
                    {{ value }}
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class LeftTable {
  readonly table = input.required<AngularTable<User>>()
}
