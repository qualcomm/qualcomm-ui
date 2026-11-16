import {Component, inject, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"
import {LucideSearch} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {PaginationModule} from "@qualcomm-ui/angular/pagination"
import {
  type AngularTable,
  createAngularTable,
  createTablePagination,
  TableModule,
} from "@qualcomm-ui/angular/table"
import {TextInputModule} from "@qualcomm-ui/angular/text-input"
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Row,
} from "@qualcomm-ui/core/table"

import {ColumnFilter} from "./column-filter"
import {createUserQuery, type User, userColumns} from "./data"
import {RowPinningService} from "./row-pinning.service"

@Component({
  imports: [
    ColumnFilter,
    FormsModule,
    PaginationModule,
    TableModule,
    TextInputModule,
  ],
  providers: [provideIcons({LucideSearch}), RowPinningService],
  selector: "kitchen-sink-demo",
  template: `
    <div class="mt-4" q-table-root>
      <div q-table-action-bar>
        <q-text-input
          aria-label="Filter rows"
          class="w-56"
          placeholder="Global Filter"
          startIcon="Search"
          [(ngModel)]="globalFilter"
        />
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
                    [style.min-width.px]="header.column.columnDef.minSize"
                  >
                    @if (!header.isPlaceholder) {
                      <div class="inline-flex flex-col gap-1">
                        <div
                          class="inline-flex min-h-[28px] items-center justify-center"
                        >
                          <div class="inline-flex items-center gap-2">
                            <ng-container *renderHeader="header; let value">
                              {{ value }}
                            </ng-container>
                            @if (header.column.getCanSort()) {
                              <button
                                q-table-column-sort-action
                                [header]="header"
                                [isSorted]="header.column.getIsSorted()"
                              ></button>
                            }
                          </div>
                        </div>
                        @if (header.column.getCanFilter()) {
                          <app-column-filter
                            [column]="header.column"
                            [table]="table()"
                          />
                        }
                      </div>
                    }
                  </th>
                }
              </tr>
            }
          </thead>
          <tbody q-table-body>
            @for (row of table.getTopRows(); track row.id) {
              <tr
                class="sticky"
                q-table-row
                [isSelected]="true"
                [style.top.px]="getPinnedRowTop(row)"
              >
                @for (cell of row.getVisibleCells(); track cell.id) {
                  <td q-table-cell>
                    <ng-container *renderCell="cell; let value">
                      {{ value }}
                    </ng-container>
                  </td>
                }
              </tr>
            }
            @for (row of table.getCenterRows(); track row.id) {
              <tr q-table-row [isSelected]="row.getIsSelected()">
                @for (cell of row.getVisibleCells(); track cell.id) {
                  <td
                    q-table-cell
                    [style.min-width.px]="cell.column.columnDef.minSize"
                  >
                    <ng-container *renderCell="cell; let value">
                      {{ value }}
                    </ng-container>
                  </td>
                }
              </tr>
            }
            @for (row of table.getBottomRows(); track row.id) {
              <tr
                class="sticky"
                q-table-row
                [isSelected]="true"
                [style.bottom.px]="getPinnedRowBottom(row)"
              >
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
export class KitchenSinkDemo {
  protected readonly query = createUserQuery(1000, 2, 2)
  protected readonly rowPinningService = inject(RowPinningService)
  readonly globalFilter = signal<string>("")

  protected table: AngularTable<User> = createAngularTable(() => ({
    columns: userColumns,
    data: this.query.data() || [],
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getSubRows: (row: User) => row.subRows,
    keepPinnedRows: this.rowPinningService.keepPinnedRows(),
    sortDescFirst: true,
    state: {
      globalFilter: this.globalFilter(),
    },
  }))

  protected pagination = createTablePagination(this.table)

  /**
   * Pinned rows stack below the sticky header (48px), one row height (26px)
   * apart.
   */
  protected getPinnedRowTop(row: Row<User>): number {
    return row.getPinnedIndex() * 26 + 48
  }

  protected getPinnedRowBottom(row: Row<User>): number {
    return (this.table.getBottomRows().length - 1 - row.getPinnedIndex()) * 26
  }
}
