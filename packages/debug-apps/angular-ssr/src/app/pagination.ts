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
  styles: `
    .section {
      margin-bottom: 3rem;
    }

    .section-title {
      font: var(--font-static-heading-md-default);
      margin-bottom: 1rem;
      color: var(--color-text-neutral-primary);
    }

    .demo-container {
      padding: 2rem;
      border: 1px solid var(--color-border-neutral-01);
      border-radius: 8px;
      background-color: var(--color-background-neutral-01);
    }
  `,
  template: `
    <div
      class="container"
      style="max-width: 1200px; margin: 0 auto; padding: 2rem;"
    >
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
