import {Component} from "@angular/core"

import {ActionGroupDirective} from "@qualcomm-ui/angular/action-group"
import {PaginationModule} from "@qualcomm-ui/angular/pagination"

@Component({
  imports: [PaginationModule, ActionGroupDirective],
  selector: "pagination-page-metadata-demo",
  standalone: true,
  template: `
    <div class="flex flex-col">
      <!-- preview -->
      <div count="125" defaultPageSize="10" q-pagination-root>
        <!-- Current and total pages -->
        <span *paginationContext="let context" q-pagination-page-metadata>
          @let meta = context.pageMetadata;
          {{ meta.page }} of {{ meta.pageCount }}
        </span>

        <div q-action-group>
          <button q-pagination-prev-trigger></button>
          <q-pagination-page-items />
          <button q-pagination-next-trigger></button>
        </div>
      </div>

      <div
        class="mt-6 flex justify-center"
        count="125"
        defaultPageSize="10"
        q-pagination-root
      >
        <!-- Page start and end with total count -->
        <span *paginationContext="let context" q-pagination-page-metadata>
          @let meta = context.pageMetadata;
          {{ meta.pageStart }}-{{ meta.pageEnd }} of {{ meta.count }}
        </span>

        <div q-action-group>
          <button q-pagination-prev-trigger></button>
          <q-pagination-page-items />
          <button q-pagination-next-trigger></button>
        </div>
      </div>
      <!-- preview -->
    </div>
  `,
})
export class PaginationPageMetadataDemo {}
