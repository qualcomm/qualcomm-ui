import {Component} from "@angular/core"

import {ActionGroupDirective} from "@qualcomm-ui/angular/action-group"
import {PaginationModule} from "@qualcomm-ui/angular/pagination"

@Component({
  imports: [PaginationModule, ActionGroupDirective],
  selector: "pagination-directive-showcase-demo",
  template: `
    <!-- preview -->
    <div count="120" defaultPageSize="10" q-pagination-root>
      <div q-action-group>
        <button q-pagination-prev-trigger></button>
        <q-pagination-page-items />
        <button q-pagination-next-trigger></button>
      </div>
    </div>
    <!-- preview -->
  `,
})
export class PaginationShowcaseDemo {}
