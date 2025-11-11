import {Directive} from "@angular/core"

import {CorePaginationPageMetadataDirective} from "@qualcomm-ui/angular-core/pagination"
import {paginationClasses} from "@qualcomm-ui/qds-core/pagination"

@Directive({
  host: {
    "[class]": "paginationClasses.pageMetadata",
  },
  selector: "[q-pagination-page-metadata]",
  standalone: false,
})
export class PaginationPageMetadataDirective extends CorePaginationPageMetadataDirective {
  protected readonly paginationClasses = paginationClasses
}
