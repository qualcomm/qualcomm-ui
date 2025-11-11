import {Component} from "@angular/core"

import {ActionGroupDirective} from "@qualcomm-ui/angular/action-group"
import {PaginationModule} from "@qualcomm-ui/angular/pagination"

@Component({
  imports: [ActionGroupDirective, PaginationModule],
  selector: "pagination-page-size-demo",
  template: `
    <!-- preview -->
    <div count="120" defaultPageSize="10" q-pagination-root>
      <div q-action-group>
        <button q-pagination-prev-trigger></button>
        <q-pagination-page-items />
        <button q-pagination-next-trigger></button>
      </div>

      <div q-pagination-page-size [options]="[5, 10, 20, 50, 100]">
        <span q-pagination-page-size-label>Page size</span>
      </div>
    </div>
    <!-- preview -->
  `,
})
export class PaginationPageSizeDemo {}
