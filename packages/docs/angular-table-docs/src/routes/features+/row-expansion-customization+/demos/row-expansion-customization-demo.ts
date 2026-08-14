import {JsonPipe} from "@angular/common"
import {Component} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"
import {createAngularTable, TableModule} from "@qualcomm-ui/angular/table"
import {getCoreRowModel, getExpandedRowModel} from "@qualcomm-ui/core/table"

import {createUserQuery, type User, userColumns} from "./data"

@Component({
  imports: [TableModule, ButtonModule, ProgressRingModule, JsonPipe],
  selector: "row-expansion-customization-demo",
  template: `
    <div q-table-root>
      <div q-table-action-bar>
        <button
          q-button
          size="sm"
          variant="outline"
          [disabled]="query.isFetching()"
          (click)="query.refetch()"
        >
          Refresh Data
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
                    q-table-header-cell
                    [attr.colspan]="header.colSpan"
                    [style.minWidth.px]="header.column.columnDef.minSize"
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
              @if (row.getIsExpanded()) {
                <tr q-table-row>
                  <td
                    q-table-cell
                    [attr.colspan]="row.getVisibleCells().length"
                  >
                    <pre
                      class="w-fit rounded bg-transparent p-2 font-mono text-xs"
                      >{{ row.original | json }}</pre>
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class RowExpansionCustomizationDemo {
  protected readonly query = createUserQuery(10)

  protected table = createAngularTable<User>(() => ({
    columns: userColumns,
    data: this.query.data() || [],
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
  }))
}
