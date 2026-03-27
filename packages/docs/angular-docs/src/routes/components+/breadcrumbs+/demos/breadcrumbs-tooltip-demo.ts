import {Component} from "@angular/core"

import {BreadcrumbsModule} from "@qualcomm-ui/angular/breadcrumbs"

@Component({
  imports: [BreadcrumbsModule],
  selector: "breadcrumbs-tooltip-demo",
  template: `
    <!-- preview -->
    <nav aria-label="Breadcrumbs" class="mt-4" q-breadcrumbs-root>
      <ol q-breadcrumbs-list>
        <li q-breadcrumb-item tooltip="Navigate to home page">Home</li>
        <li q-breadcrumb-item tooltip="View all components">Components</li>
        <li aria-current="page" q-breadcrumb-item>Breadcrumbs</li>
      </ol>
    </nav>
    <!-- preview -->
  `,
})
export class BreadcrumbsTooltipDemo {}
