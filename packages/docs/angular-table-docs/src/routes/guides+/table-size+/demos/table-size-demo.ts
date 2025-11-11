import {Component} from "@angular/core"

import {TableModule} from "@qualcomm-ui/angular/table"
import type {QdsTableSize} from "@qualcomm-ui/qds-core/table"

@Component({
  imports: [TableModule],
  selector: "table-size-demo",
  template: `
    @for (size of sizes; track size) {
      <div q-table-root [size]="size">
        <div q-table-scroll-container>
          <table q-table-table>
            <thead q-table-header>
              <tr q-table-row></tr>
            </thead>
          </table>
        </div>
      </div>
    }
  `,
})
export class TableSizeDemo {
  sizes: QdsTableSize[] = ["sm", "md", "lg"]
}
