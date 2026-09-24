import {Component, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"
import {LucideSearch} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {ButtonModule} from "@qualcomm-ui/angular/button"
import {PaginationModule} from "@qualcomm-ui/angular/pagination"
import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"
import {
  type AngularTable,
  createAngularTable,
  createTablePagination,
  TableModule,
} from "@qualcomm-ui/angular/table"
import {TextInputModule} from "@qualcomm-ui/angular/text-input"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type RowSelectionState,
} from "@qualcomm-ui/core/table"

import {createUserQuery, type User, userColumns} from "./data"

@Component({
  imports: [
    TableModule,
    TextInputModule,
    FormsModule,
    ButtonModule,
    ProgressRingModule,
    PaginationModule,
  ],
  providers: [provideIcons({LucideSearch})],
  selector: "row-selection-demo",
  template: `
    <div class="flex w-full flex-col gap-4 p-2">
      <div q-table-root>
        <div q-table-action-bar>
          <q-text-input
            aria-label="Search columns"
            class="w-56"
            placeholder="Search every column..."
            size="sm"
            startIcon="Search"
            [(ngModel)]="globalFilter"
          />
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
                    <th q-table-header-cell [attr.colspan]="header.colSpan">
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
                <tr q-table-row [isSelected]="row.getIsSelected()">
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

      <button
        class="self-start"
        q-button
        variant="outline"
        (click)="logSelectedRows()"
      >
        Log table.getSelectedRowModel().flatRows
      </button>
    </div>
  `,
})
export class RowSelectionDemo {
  protected readonly query = createUserQuery(100000)
  readonly globalFilter = signal<string>("")
  readonly rowSelection = signal<RowSelectionState>({})

  protected table: AngularTable<User> = createAngularTable(() => ({
    columns: userColumns,
    data: this.query.data() || [],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: (updater) => {
      if (typeof updater === "function") {
        this.rowSelection.update(updater)
      } else {
        this.rowSelection.set(updater)
      }
    },
    state: {
      globalFilter: this.globalFilter(),
      rowSelection: this.rowSelection(),
    },
  }))

  protected pagination = createTablePagination(this.table)

  protected logSelectedRows() {
    console.info(
      "table.getSelectedRowModel().flatRows",
      this.table().getSelectedRowModel().flatRows,
    )
  }
}
