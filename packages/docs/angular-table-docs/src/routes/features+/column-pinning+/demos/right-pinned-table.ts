import {Component, input} from "@angular/core"

import {type AngularTable, TableModule} from "@qualcomm-ui/angular/table"

import type {User} from "./data"

@Component({
  imports: [TableModule],
  selector: "right-pinned-table",
  template: `
    <div q-table-root showColumnDivider>
      <table q-table-table></table>
    </div>
  `,
})
export class RightPinnedTable {
  readonly table = input.required<AngularTable<User>>()
}
