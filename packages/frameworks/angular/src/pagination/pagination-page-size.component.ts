import {Component} from "@angular/core"

import {CorePaginationPageSizeDirective} from "@qualcomm-ui/angular-core/pagination"
import {paginationClasses} from "@qualcomm-ui/qds-core/pagination"

@Component({
  host: {
    "[class]": "paginationClasses.pageSize",
  },
  selector: "[q-pagination-page-size]",
  standalone: false,
  template: `
    <ng-content />
    <q-menu (selected)="inputOptionChanged($event)">
      <button
        emphasis="neutral"
        q-menu-button
        variant="outline"
        [attr.aria-label]="inputAriaLabel()"
        [attr.aria-labelledby]="inputAriaLabelledBy()"
      >
        {{ currentValue() }}
      </button>
      <q-portal>
        <div q-menu-positioner>
          <div q-menu-content>
            @for (option of menuOptions(); track option) {
              <button q-menu-item [value]="option">{{ option }}</button>
            }
          </div>
        </div>
      </q-portal>
    </q-menu>
  `,
})
export class PaginationPageSizeComponent extends CorePaginationPageSizeDirective {
  protected readonly paginationClasses = paginationClasses
}
