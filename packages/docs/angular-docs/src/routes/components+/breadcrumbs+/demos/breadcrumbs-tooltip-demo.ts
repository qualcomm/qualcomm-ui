import {Component} from "@angular/core"
import {Home} from "lucide-angular"

import {BreadcrumbsModule} from "@qualcomm-ui/angular/breadcrumbs"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {TooltipModule} from "@qualcomm-ui/angular/tooltip"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [BreadcrumbsModule, IconDirective, TooltipModule],
  providers: [provideIcons({Home})],
  selector: "breadcrumbs-tooltip-demo",
  template: `
    <!-- preview -->
    <nav aria-label="Breadcrumbs" q-breadcrumbs-root>
      <ol q-breadcrumbs-list>
        <li q-breadcrumb-item>
          <div q-tooltip>
            <a q-breadcrumb-item-trigger q-tooltip-trigger>
              <svg q-breadcrumb-item-icon qIcon="Home"></svg>
              Home
            </a>
            Navigate to home page
          </div>
        </li>
        <li q-breadcrumb-item>
          <div q-tooltip>
            <a q-breadcrumb-item-trigger q-tooltip-trigger>Components</a>
            Browse all components
          </div>
        </li>
        <li aria-current="page" q-breadcrumb-item>Breadcrumbs</li>
      </ol>
    </nav>
    <!-- preview -->
  `,
})
export class BreadcrumbsTooltipDemo {}
