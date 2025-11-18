import {Component, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"
import {Search} from "lucide-angular"

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
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
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
  providers: [provideIcons({Search})],
  selector: "filters-demo",
  template: `
    <div q-table-root>
      <div q-table-action-bar>
        <q-text-input
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
export class FiltersDemo {
  protected readonly query = createUserQuery(100000)
  readonly globalFilter = signal<string>("")

  protected table: AngularTable<User> = createAngularTable(() => ({
    columns: userColumns,
    data: this.query.data() || [],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter: this.globalFilter(),
    },
  }))

  protected pagination = createTablePagination(this.table)
}
