import {Component} from "@angular/core"

import {ActionGroupDirective} from "@qualcomm-ui/angular/action-group"
import {PaginationModule} from "@qualcomm-ui/angular/pagination"

@Component({
  imports: [PaginationModule, ActionGroupDirective],
  selector: "pagination-directive-ranges-demo",
  standalone: true,
  template: `
    <!-- preview -->
    <div class="grid gap-4">
      <div count="12" defaultPage="6" q-pagination-root siblingCount="0">
        <div q-action-group>
          <button q-pagination-prev-trigger></button>
          <q-pagination-page-items />
          <button q-pagination-next-trigger></button>
        </div>
      </div>

      <!-- Default -->
      <div count="12" defaultPage="6" q-pagination-root>
        <div q-action-group>
          <button q-pagination-prev-trigger></button>
          <q-pagination-page-items />
          <button q-pagination-next-trigger></button>
        </div>
      </div>

      <div count="12" defaultPage="6" q-pagination-root siblingCount="2">
        <div q-action-group>
          <button q-pagination-prev-trigger></button>
          <q-pagination-page-items />
          <button q-pagination-next-trigger></button>
        </div>
      </div>
    </div>
    <!-- preview -->
  `,
})
export class PaginationRangesDemo {}
