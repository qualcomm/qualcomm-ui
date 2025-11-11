import {Component, computed, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"
import {RadioModule} from "@qualcomm-ui/angular/radio"
import {
  type AngularTable,
  createAngularTable,
  TableModule,
} from "@qualcomm-ui/angular/table"
import {
  type ColumnResizeDirection,
  type ColumnResizeMode,
  getCoreRowModel,
} from "@qualcomm-ui/core/table"

import {columns, createUserQuery, type User} from "./data"

@Component({
  imports: [
    TableModule,
    ButtonModule,
    ProgressRingModule,
    RadioModule,
    FormsModule,
  ],
  selector: "column-sizing-demo",
  template: `
    <div class="flex w-full flex-col gap-4 p-2">
      <div q-table-root showColumnDivider>
        <div class="gap-8" q-table-action-bar>
          <button q-button variant="outline" (click)="query.refetch()">
            Regenerate
          </button>

          <fieldset
            name="resizeMode"
            orientation="horizontal"
            q-radio-group
            [(ngModel)]="columnResizeMode"
          >
            <div q-radio-group-label>Resize</div>
            <div q-radio-group-items>
              <label label="onChange" q-radio value="onChange"></label>
              <label label="onEnd" q-radio value="onEnd"></label>
            </div>
          </fieldset>

          <fieldset
            name="direction"
            orientation="horizontal"
            q-radio-group
            [(ngModel)]="columnResizeDirection"
          >
            <div q-radio-group-label>Direction</div>
            <div q-radio-group-items>
              <label label="ltr" q-radio value="ltr"></label>
              <label label="rtl" q-radio value="rtl"></label>
            </div>
          </fieldset>
        </div>

        <div q-table-scroll-container>
          <table
            q-table-table
            [attr.dir]="columnResizeDirection()"
            [style.width.px]="table().getCenterTotalSize()"
          >
            <thead q-table-header>
              @for (
                headerGroup of table().getHeaderGroups();
                track headerGroup.id
              ) {
                <tr q-table-row>
                  @for (header of headerGroup.headers; track header.id) {
                    <th
                      class="relative text-justify"
                      q-table-header-cell
                      [colSpan]="header.colSpan"
                      [style.width.px]="header.getSize()"
                    >
                      <div
                        class="inline-flex w-full items-center justify-between gap-4"
                      >
                        @if (!header.isPlaceholder) {
                          <ng-container *renderHeader="header; let value">
                            {{ value }}
                          </ng-container>
                        }

                        <div
                          q-table-column-resize-handle
                          [header]="header"
                        ></div>
                      </div>
                    </th>
                  }
                </tr>
              }
            </thead>
            <tbody q-table-body>
              @for (row of table().getRowModel().rows; track row.id) {
                <tr q-table-row>
                  @for (cell of row.getVisibleCells(); track cell.id) {
                    <td q-table-cell [style.width.px]="cell.column.getSize()">
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
    </div>
  `,
})
export class ColumnSizingDemo {
  protected readonly query = createUserQuery(5)

  protected readonly columnResizeMode = signal<ColumnResizeMode>("onChange")

  protected readonly columnResizeDirection =
    signal<ColumnResizeDirection>("ltr")

  protected readonly table = computed<AngularTable<User>>(() =>
    createAngularTable(() => ({
      columnResizeDirection: this.columnResizeDirection(),
      columnResizeMode: this.columnResizeMode(),
      columns,
      data: this.query.data() || [],
      getCoreRowModel: getCoreRowModel(),
    })),
  )
}
