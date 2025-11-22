import {Component, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {PaginationModule} from "@qualcomm-ui/angular/pagination"
import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"
import {
  type AngularTable,
  createAngularTable,
  createTablePagination,
  TableModule,
} from "@qualcomm-ui/angular/table"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@qualcomm-ui/core/table"

import {createUserQuery, type User, userColumns} from "./data"

@Component({
  imports: [
    TableModule,
    PaginationModule,
    ButtonModule,
    ProgressRingModule,
    FormsModule,
  ],
  selector: "pagination-demo",
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
      <div
        q-table-pagination
        [count]="pagination.count()"
        [page]="pagination.page()"
        [pageSize]="pagination.pageSize()"
        (pageChanged)="pagination.onPageChange($event)"
      >
        <div *paginationContext="let context" q-pagination-page-metadata>
          @let meta = context.pageMetadata;
          {{ meta.pageStart }}-{{ meta.pageEnd }} of {{ meta.count }} results
        </div>

        <div q-pagination-page-buttons></div>
      </div>
    </div>
  `,
})
export class PaginationDemo {
  readonly globalFilter = signal<string>("")
  protected readonly query = createUserQuery(1200)

  protected table: AngularTable<User> = createAngularTable(() => ({
    columns: userColumns,
    data: this.query.data() || [],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  }))

  protected pagination = createTablePagination(this.table)
}
