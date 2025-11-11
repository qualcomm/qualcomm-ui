import {Component, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {CheckboxModule} from "@qualcomm-ui/angular/checkbox"
import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"
import {
  type AngularTable,
  createAngularTable,
  TableModule,
} from "@qualcomm-ui/angular/table"
import {getCoreRowModel} from "@qualcomm-ui/core/table"

import {columns, createUserQuery, type User} from "./data"
import {LeftTable} from "./left-table"
import {PinnableHeader} from "./pinnable-header"
import {RightTable} from "./right-table"

@Component({
  imports: [
    TableModule,
    ButtonModule,
    ProgressRingModule,
    FormsModule,
    CheckboxModule,
    PinnableHeader,
    LeftTable,
    RightTable,
  ],
  selector: "column-pinning-demo",
  template: `
    <div class="flex w-full flex-col gap-4 p-2">
      <div class="flex flex-wrap items-center gap-2">
        <button q-button variant="outline" (click)="query.refetch()">
          Regenerate
        </button>
        @if (query.isFetching()) {
          <div q-progress-ring size="xs"></div>
        }
      </div>

      <div>
        <label
          label="Split pinned columns into multiple tables"
          q-checkbox
          size="sm"
          [(ngModel)]="isSplit"
        ></label>
      </div>

      <div class="flex gap-4">
        @if (isSplit() && table().getIsSomeColumnsPinned("left")) {
          <left-table [table]="table" />
        }

        @if (
          (isSplit() && table().getCenterFlatHeaders().length) || !isSplit()
        ) {
          <div q-table-root>
            <div q-table-scroll-container>
              <table q-table-table>
                <thead q-table-header>
                  @for (
                    headerGroup of isSplit()
                      ? table.getCenterHeaderGroups()
                      : table.getHeaderGroups();
                    track headerGroup.id
                  ) {
                    <tr q-table-row>
                      @for (header of headerGroup.headers; track header.id) {
                        <th
                          pinnable-header
                          q-table-header-cell
                          [header]="header"
                        ></th>
                      }
                    </tr>
                  }
                </thead>
                <tbody q-table-body>
                  @for (row of table.getRowModel().rows; track row.id) {
                    <tr q-table-row>
                      @for (
                        cell of isSplit()
                          ? row.getCenterVisibleCells()
                          : row.getVisibleCells();
                        track cell.id
                      ) {
                        <td *renderCell="cell; let value" q-table-cell>
                          {{ value }}
                        </td>
                      }
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        @if (isSplit() && table().getIsSomeColumnsPinned("right")) {
          <right-table [table]="table" />
        }
      </div>
    </div>
  `,
})
export class ColumnPinningDemo {
  protected readonly query = createUserQuery(10)

  protected readonly isSplit = signal(false)

  protected table: AngularTable<User> = createAngularTable(() => ({
    columns,
    data: this.query.data() || [],
    getCoreRowModel: getCoreRowModel(),
  }))
}
