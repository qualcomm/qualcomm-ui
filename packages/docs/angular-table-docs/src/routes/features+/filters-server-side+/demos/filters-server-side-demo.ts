import {Component, computed, effect, signal} from "@angular/core"
import {toObservable, toSignal} from "@angular/core/rxjs-interop"
import {FormsModule} from "@angular/forms"
import {injectQuery} from "@tanstack/angular-query-experimental"
import {Search} from "lucide-angular"
import {debounceTime} from "rxjs"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {PaginationModule} from "@qualcomm-ui/angular/pagination"
import {PopoverModule} from "@qualcomm-ui/angular/popover"
import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"
import {
  type AngularTable,
  createAngularTable,
  createTablePagination,
  TableModule,
} from "@qualcomm-ui/angular/table"
import {TextInputModule} from "@qualcomm-ui/angular/text-input"
import {
  type ColumnFiltersState,
  getCoreRowModel,
  type PaginationState,
  type SortingState,
} from "@qualcomm-ui/core/table"

import {fetchData, type FetchResult, type User, userColumns} from "./data"
import {TableColumnFilter} from "./table-column-filter"

@Component({
  imports: [
    TableModule,
    TextInputModule,
    FormsModule,
    ProgressRingModule,
    PaginationModule,
    PopoverModule,
    TableColumnFilter,
  ],
  providers: [provideIcons({Search})],
  selector: "filters-server-side-demo",
  template: `
    <div class="flex w-full flex-col gap-4 p-2">
      <div q-table-root>
        <div q-table-action-bar>
          <q-text-input
            aria-label="Search columns"
            class="w-56"
            placeholder="Search all columns..."
            size="sm"
            startIcon="Search"
            [(ngModel)]="globalFilter"
          />
          <div
            class="text-neutral-primary font-body-sm flex items-center gap-1"
          >
            <span>Query:</span>
            <span>{{ query.fetchStatus() }}</span>
            @if (query.isFetching()) {
              <div class="ml-1" q-progress-ring size="xs"></div>
            }
          </div>
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
                    <th q-table-header-cell [style.width.px]="header.getSize()">
                      @if (!header.isPlaceholder) {
                        <div
                          class="inline-flex min-h-[28px] w-full items-center justify-between gap-2"
                        >
                          <div class="inline-flex items-center gap-1">
                            <ng-container *renderHeader="header; let value">
                              {{ value }}
                            </ng-container>
                            <button
                              q-table-column-sort-action
                              [header]="header"
                              [isSorted]="header.column.getIsSorted()"
                            ></button>
                          </div>
                          @if (header.column.getCanFilter()) {
                            <div q-popover>
                              <div q-popover-anchor>
                                <button
                                  q-popover-trigger
                                  q-table-column-filter-action
                                  [canFilter]="header.column.getCanFilter()"
                                  [isFiltered]="header.column.getIsFiltered()"
                                ></button>
                              </div>

                              <app-table-column-filter
                                [availableFilters]="
                                  queryData().availableFilters
                                "
                                [column]="header.column"
                                [columnFilters]="columnFilters()"
                                (columnFiltersChange)="
                                  columnFilters.set($event)
                                "
                              />
                            </div>
                          }
                        </div>
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
        <div
          q-table-pagination
          [count]="pagination.count()"
          [page]="pagination.page()"
          [pageSize]="pagination.pageSize()"
          (pageChanged)="pagination.onPageChange($event)"
        >
          <div *paginationContext="let context" q-pagination-page-metadata>
            @let meta = context.pageMetadata;
            @if (!queryData().pageCount && query.isFetching()) {
              <div q-progress-ring size="xs"></div>
            } @else {
              {{ meta.pageStart }}-{{ meta.pageEnd }} of
              {{ meta.count }} results
            }
          </div>

          <div q-pagination-page-buttons></div>
        </div>
      </div>
    </div>
  `,
})
export class FiltersServerSideDemo {
  protected readonly paginationState = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  protected readonly columnFilters = signal<ColumnFiltersState>([])
  protected readonly globalFilter = signal<string>("")
  protected readonly sorting = signal<SortingState>([])

  // Create debounced versions of filters
  private readonly debouncedColumnFilters = toSignal(
    toObservable(this.columnFilters).pipe(debounceTime(300)),
    {initialValue: [] as ColumnFiltersState},
  )

  private readonly debouncedGlobalFilter = toSignal(
    toObservable(this.globalFilter).pipe(debounceTime(300)),
    {initialValue: ""},
  )

  protected readonly query = injectQuery<FetchResult>(() => ({
    placeholderData: (previousData) => previousData,
    queryFn: async () =>
      fetchData({
        columnFilters: this.debouncedColumnFilters(),
        globalFilter: this.debouncedGlobalFilter(),
        pageIndex: this.paginationState().pageIndex,
        pageSize: this.paginationState().pageSize,
        sorting: this.sorting(),
      }),
    queryKey: [
      "data",
      this.paginationState(),
      this.debouncedColumnFilters(),
      this.debouncedGlobalFilter(),
      this.sorting(),
    ],
  }))

  readonly queryData = computed(
    () =>
      this.query.data() ?? {
        availableFilters: {},
        pageCount: 0,
        totalUsers: 0,
        users: [],
      },
  )

  protected table: AngularTable<User> = createAngularTable(() => ({
    columns: userColumns,
    data: this.queryData().users,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onColumnFiltersChange: (updater) => {
      if (typeof updater === "function") {
        this.columnFilters.update(updater)
      } else {
        this.columnFilters.set(updater)
      }
    },
    onGlobalFilterChange: (updater) => {
      if (typeof updater === "function") {
        this.globalFilter.update(updater)
      } else {
        this.globalFilter.set(updater ?? "")
      }
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        this.paginationState.update(updater)
      } else {
        this.paginationState.set(updater)
      }
    },
    onSortingChange: (updater) => {
      if (typeof updater === "function") {
        this.sorting.update(updater)
      } else {
        this.sorting.set(updater)
      }
    },
    pageCount: this.queryData().pageCount || 0,
    state: {
      columnFilters: this.columnFilters(),
      globalFilter: this.globalFilter(),
      pagination: this.paginationState(),
      sorting: this.sorting(),
    },
  }))

  protected pagination = createTablePagination(this.table, {
    totalCount: computed(() => this.queryData().totalUsers),
  })

  constructor() {
    // Reset to first page when filters change
    effect(() => {
      // Read the debounced values to track them
      this.debouncedColumnFilters()
      this.debouncedGlobalFilter()
      // Reset pagination to first page
      this.paginationState.update((state) => ({...state, pageIndex: 0}))
    })
  }
}
