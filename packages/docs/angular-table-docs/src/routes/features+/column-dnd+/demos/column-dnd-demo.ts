import {Component, signal} from "@angular/core"

import {
  type AngularTable,
  createAngularTable,
  TableModule,
} from "@qualcomm-ui/angular/table"
import {getCoreRowModel} from "@qualcomm-ui/core/table"

import {createUserQuery, type User, userColumns} from "./data"
import {DraggableColumnHeaderComponent} from "./draggable-column-header"

@Component({
  imports: [TableModule, DraggableColumnHeaderComponent],
  selector: "column-dnd-demo",
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
                  <th
                    draggable-column-header
                    [header]="header"
                    [table]="table"
                  ></th>
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
export class ColumnDndDemo {
  readonly query = createUserQuery(10)

  protected readonly columnOrder = signal(
    userColumns.map((column) => column.id!),
  )

  protected table: AngularTable<User> = createAngularTable(() => ({
    columns: userColumns,
    data: this.query.data() || [],
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnOrder: this.columnOrder(),
    },
  }))
}
