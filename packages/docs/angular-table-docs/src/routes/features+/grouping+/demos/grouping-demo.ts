import {Component} from "@angular/core"
import {Combine, Ungroup} from "lucide-angular"

import {
  type AngularTable,
  createAngularTable,
  TableModule,
} from "@qualcomm-ui/angular/table"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  type Row,
} from "@qualcomm-ui/core/table"

import {createUserQuery, type User, userColumns} from "./data"

@Component({
  imports: [TableModule],
  providers: [provideIcons({Combine, Ungroup})],
  selector: "grouping-demo",
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
                    @if (!header.isPlaceholder) {
                      <div class="flex items-center gap-1">
                        @if (header.column.getCanGroup()) {
                          <button
                            q-table-column-header-action
                            [icon]="
                              header.column.getIsGrouped()
                                ? 'Ungroup'
                                : 'Combine'
                            "
                            (click)="header.column.toggleGrouping()"
                          ></button>
                        }
                        <ng-container *renderHeader="header; let value">
                          {{ value }}
                        </ng-container>
                      </div>
                    }
                  </th>
                }
              </tr>
            }
          </thead>
          <tbody q-table-body>
            @for (row of table.getRowModel().rows; track trackRow(row)) {
              <tr q-table-row>
                @for (cell of row.getVisibleCells(); track cell.id) {
                  <td q-table-cell>
                    @if (cell.getIsGrouped()) {
                      <!-- If it's a grouped cell, add an expander and row count -->
                      <div class="inline-flex items-center gap-2">
                        @if (row.getCanExpand()) {
                          <button
                            q-table-row-expand-button
                            [isExpanded]="row.getIsExpanded()"
                            [row]="row"
                          ></button>
                        }
                      </div>
                    }
                    <ng-container
                      *renderCell="
                        cell;
                        isAggregated: cell.getIsAggregated();
                        let value
                      "
                    >
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
export class GroupingDemo {
  protected readonly query = createUserQuery(10000)

  protected table: AngularTable<User> = createAngularTable(() => ({
    columns: userColumns,
    data: this.query.data() || [],
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: this.query.data()?.length
      ? getGroupedRowModel()
      : undefined,
    getPaginationRowModel: getPaginationRowModel(),
  }))

  protected trackRow(row: Row<User>) {
    return `${row.id}-${row.getIsExpanded()}`
  }
}
