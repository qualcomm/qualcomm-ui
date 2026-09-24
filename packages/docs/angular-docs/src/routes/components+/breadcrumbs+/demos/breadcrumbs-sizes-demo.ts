import {Component} from "@angular/core"
import {LucideHouse} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {BreadcrumbsModule} from "@qualcomm-ui/angular/breadcrumbs"
import {IconDirective} from "@qualcomm-ui/angular/icon"

@Component({
  imports: [BreadcrumbsModule, IconDirective],
  providers: [provideIcons({LucideHouse})],
  selector: "breadcrumbs-sizes-demo",
  template: `
    <div class="flex flex-col gap-4">
      <nav aria-label="Breadcrumbs" q-breadcrumbs-root size="sm">
        <ol q-breadcrumbs-list>
          <li q-breadcrumb-item>
            <a href="/" q-breadcrumb-item-trigger>
              <svg q-breadcrumb-item-icon qIcon="House"></svg>
              Home
            </a>
          </li>
          <li q-breadcrumb-item>
            <a href="/components/overview" q-breadcrumb-item-trigger>
              Components
            </a>
          </li>
          <li aria-current="page" q-breadcrumb-item>Breadcrumbs</li>
        </ol>
      </nav>

      <nav aria-label="Breadcrumbs" q-breadcrumbs-root size="md">
        <ol q-breadcrumbs-list>
          <li q-breadcrumb-item>
            <a href="/" q-breadcrumb-item-trigger>
              <svg q-breadcrumb-item-icon qIcon="House"></svg>
              Home
            </a>
          </li>
          <li q-breadcrumb-item>
            <a href="/components/overview" q-breadcrumb-item-trigger>
              Components
            </a>
          </li>
          <li aria-current="page" q-breadcrumb-item>Breadcrumbs</li>
        </ol>
      </nav>

      <!-- preview -->
      <nav aria-label="Breadcrumbs" q-breadcrumbs-root size="lg">
        <ol q-breadcrumbs-list>
          <li q-breadcrumb-item>
            <a href="/" q-breadcrumb-item-trigger>
              <svg q-breadcrumb-item-icon qIcon="House"></svg>
              Home
            </a>
          </li>
          <li q-breadcrumb-item>
            <a href="/components/overview" q-breadcrumb-item-trigger>
              Components
            </a>
          </li>
          <li aria-current="page" q-breadcrumb-item>Breadcrumbs</li>
        </ol>
      </nav>
      <!-- preview -->
    </div>
  `,
})
export class BreadcrumbsSizesDemo {}
