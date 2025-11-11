import {JsonPipe} from "@angular/common"
import {Component, computed, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {CheckboxModule} from "@qualcomm-ui/angular/checkbox"
import {
  type AngularTable,
  createAngularTable,
  TableModule,
} from "@qualcomm-ui/angular/table"
import {getCoreRowModel, type VisibilityState} from "@qualcomm-ui/core/table"

import {createUserQuery, type User, userColumns} from "./data"

@Component({
  imports: [TableModule, CheckboxModule, JsonPipe, FormsModule],
  selector: "column-visibility-demo",
  template: `
    <div class="flex w-full flex-col gap-4 p-2">
      <div class="flex gap-4">
        <div
          class="border-neutral-01 inline-flex flex-col gap-1 rounded border p-2"
        >
          <label
            q-checkbox
            size="sm"
            [ngModel]="table().getIsAllColumnsVisible()"
            (ngModelChange)="onToggleAllColumns($event)"
          >
            <span class="q-body-s strong" q-checkbox-label>Toggle All</span>
          </label>

          @for (column of table().getAllLeafColumns(); track column.id) {
            <label
              q-checkbox
              size="sm"
              [ngModel]="column.getIsVisible()"
              (ngModelChange)="onToggleColumn(column.id, $event)"
            >
              <span q-checkbox-label>{{ column.id }}</span>
            </label>
          }
        </div>
        <pre
          class="font-code-sm border-neutral-01 w-fit overflow-auto rounded border p-4"
          >{{ tableState() | json }}</pre
        >
      </div>

      <div q-table-root>
        <div q-table-scroll-container>
          <table q-table-table>
            <thead q-table-header>
              @for (
                headerGroup of table().getHeaderGroups();
                track headerGroup.id
              ) {
                <tr q-table-row>
                  @for (header of headerGroup.headers; track header.id) {
                    <th q-table-header-cell [colSpan]="header.colSpan">
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
              @for (row of table().getRowModel().rows; track row.id) {
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
    </div>
  `,
})
export class ColumnVisibilityDemo {
  protected readonly query = createUserQuery(5)

  protected readonly columnVisibility = signal<VisibilityState>({})

  protected readonly table = computed<AngularTable<User>>(() =>
    createAngularTable(() => ({
      columns: userColumns,
      data: this.query.data() || [],
      getCoreRowModel: getCoreRowModel(),
      onColumnVisibilityChange: (updater) => {
        const newValue =
          typeof updater === "function"
            ? updater(this.columnVisibility())
            : updater
        this.columnVisibility.set(newValue)
      },
      state: {
        columnVisibility: this.columnVisibility(),
      },
    })),
  )

  protected readonly tableState = computed(() => ({
    columnVisibility: this.table().getState().columnVisibility,
  }))

  protected onToggleAllColumns(checked: boolean) {
    this.table().toggleAllColumnsVisible(checked)
  }

  protected onToggleColumn(columnId: string, checked: boolean) {
    this.table().getColumn(columnId)?.toggleVisibility(checked)
  }
}
