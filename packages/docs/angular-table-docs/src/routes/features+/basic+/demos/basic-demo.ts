import {Component} from "@angular/core"

import {createAngularTable, TableModule} from "@qualcomm-ui/angular/table"
import {getCoreRowModel} from "@qualcomm-ui/core/table"

import {type User, userColumns, users} from "./data"

@Component({
  imports: [TableModule],
  selector: "basic-demo",
  template: `
    <div q-table-root>
      <div q-table-scroll-container>
        <table q-table-table>
          <thead q-table-header>
            @for (
              headerGroup of table.getHeaderGroups();
              track headerGroup.id
            ) {
              <tr q-table-row>
                @for (header of headerGroup.headers; track header.id) {
                  <th *renderHeader="header; let value" q-table-header-cell>
                    {{ value }}
                  </th>
                }
              </tr>
            }
          </thead>
          <tbody q-table-body>
            @for (row of table.getRowModel().rows; track row.id) {
              <tr q-table-row>
                @for (cell of row.getVisibleCells(); track cell.id) {
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
export class BasicDemo {
  protected table = createAngularTable<User>(() => ({
    columns: userColumns,
    data: users,
    getCoreRowModel: getCoreRowModel(),
  }))
}
