import {Component} from "@angular/core"

import {PaginationPageMetadataDemo} from "@qualcomm-ui/angular-docs/components+/pagination+/demos/pagination-page-metadata-demo"
import {PaginationPageSizeDemo} from "@qualcomm-ui/angular-docs/components+/pagination+/demos/pagination-page-size-demo"
import {PaginationRangesDemo} from "@qualcomm-ui/angular-docs/components+/pagination+/demos/pagination-ranges-demo"
import {PaginationShowcaseDemo} from "@qualcomm-ui/angular-docs/components+/pagination+/demos/pagination-showcase-demo"

@Component({
  imports: [
    PaginationPageMetadataDemo,
    PaginationPageSizeDemo,
    PaginationRangesDemo,
    PaginationShowcaseDemo,
  ],
  selector: "app-pagination",
  template: `
    <div class="container">
      <div class="section">
        <h2 class="section-title">Page Metadata</h2>
        <div class="demo-container">
          <pagination-page-metadata-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Page Size</h2>
        <div class="demo-container">
          <pagination-page-size-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Ranges</h2>
        <div class="demo-container">
          <pagination-directive-ranges-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Showcase</h2>
        <div class="demo-container">
          <pagination-directive-showcase-demo />
        </div>
      </div>
    </div>
  `,
})
export class PaginationPage {}
