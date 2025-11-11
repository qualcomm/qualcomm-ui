import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"
import {
  type AngularTable,
  createAngularTable,
  TableModule,
} from "@qualcomm-ui/angular/table"
import {getCoreRowModel} from "@qualcomm-ui/core/table"

import {columns, createUserQuery, type User} from "./data"

@Component({
  imports: [TableModule, ButtonModule, ProgressRingModule],
  selector: "column-grouping-demo",
  template: `
    <div q-table-root>
      <div q-table-action-bar>
        <button q-button variant="outline" (click)="query.refetch()">
          Regenerate
        </button>
        @if (query.isFetching()) {
          <div q-progress-ring size="xs"></div>
        }
      </div>
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
                    class="text-center"
                    q-table-header-cell
                    [colSpan]="header.colSpan"
                  >
                    @if (!header.isPlaceholder) {
                      <ng-container *renderHeader="header; let value">
                        {{ value }}
                      </ng-container>
                    }
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
export class ColumnGroupingDemo {
  readonly query = createUserQuery(10)

  protected table: AngularTable<User> = createAngularTable(() => ({
    columns,
    data: this.query.data() || [],
    getCoreRowModel: getCoreRowModel(),
  }))
}
