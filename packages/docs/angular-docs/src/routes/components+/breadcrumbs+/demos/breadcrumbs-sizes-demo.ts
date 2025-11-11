import {Component} from "@angular/core"
import {Home} from "lucide-angular"

import {BreadcrumbsModule} from "@qualcomm-ui/angular/breadcrumbs"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [BreadcrumbsModule, IconDirective],
  providers: [provideIcons({Home})],
  selector: "breadcrumbs-sizes-demo",
  template: `
    <div class="flex flex-col gap-4">
      <nav aria-label="Breadcrumbs" q-breadcrumbs-root size="sm">
        <ol q-breadcrumbs-list>
          <li q-breadcrumb-item>
            <a q-breadcrumb-item-trigger>
              <svg q-breadcrumb-item-icon qIcon="Home"></svg>
              Home
            </a>
          </li>
          <li q-breadcrumb-item>
            <a q-breadcrumb-item-trigger>Components</a>
          </li>
          <li aria-current="page" q-breadcrumb-item>
            <a q-breadcrumb-item-trigger>Breadcrumbs</a>
          </li>
        </ol>
      </nav>

      <nav aria-label="Breadcrumbs" q-breadcrumbs-root size="md">
        <ol q-breadcrumbs-list>
          <li q-breadcrumb-item>
            <a q-breadcrumb-item-trigger>
              <svg q-breadcrumb-item-icon qIcon="Home"></svg>
              Home
            </a>
          </li>
          <li q-breadcrumb-item>
            <a q-breadcrumb-item-trigger>Components</a>
          </li>
          <li aria-current="page" q-breadcrumb-item>
            <a q-breadcrumb-item-trigger>Breadcrumbs</a>
          </li>
        </ol>
      </nav>

      <!-- preview -->
      <nav aria-label="Breadcrumbs" q-breadcrumbs-root size="lg">
        <ol q-breadcrumbs-list>
          <li q-breadcrumb-item>
            <a q-breadcrumb-item-trigger>
              <svg q-breadcrumb-item-icon qIcon="Home"></svg>
              Home
            </a>
          </li>
          <li q-breadcrumb-item>
            <a q-breadcrumb-item-trigger>Components</a>
          </li>
          <li aria-current="page" q-breadcrumb-item>
            <a q-breadcrumb-item-trigger>Breadcrumbs</a>
          </li>
        </ol>
      </nav>
      <!-- preview -->
    </div>
  `,
})
export class BreadcrumbsSizesDemo {}
