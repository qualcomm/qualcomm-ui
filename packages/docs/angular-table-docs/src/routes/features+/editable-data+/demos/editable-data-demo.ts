import {Component, inject} from "@angular/core"

import {
  type AngularTable,
  createAngularTable,
  TableModule,
} from "@qualcomm-ui/angular/table"
import {getCoreRowModel} from "@qualcomm-ui/core/table"

import {type User, userColumns} from "./data"
import {MutableDataService} from "./mutable-data.service"

@Component({
  imports: [TableModule],
  providers: [MutableDataService],
  selector: "editable-data-demo",
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
                  <th q-table-header-cell>
                    <ng-container *renderHeader="header; let value">
                      {{ value }}
                    </ng-container>
                  </th>
                }
              </tr>
            }
          </thead>
          <tbody q-table-body>
            @for (row of table.getRowModel().rows; track row.id) {
              <tr q-table-row>
                @for (cell of row.getVisibleCells(); track cell.id) {
                  <td q-table-cell>
                    <ng-container *renderCell="cell; let value">
                      {{ value }}
                    </ng-container>
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
export class EditableDataDemo {
  protected data = inject(MutableDataService).data

  protected table: AngularTable<User> = createAngularTable(() => ({
    columns: userColumns,
    data: this.data(),
    getCoreRowModel: getCoreRowModel(),
  }))
}
