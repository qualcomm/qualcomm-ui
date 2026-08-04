import {Component} from "@angular/core"
import {RouterLink} from "@angular/router"
import {Home} from "lucide-angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {BreadcrumbsModule} from "@qualcomm-ui/angular/breadcrumbs"
import {IconDirective} from "@qualcomm-ui/angular/icon"

@Component({
  imports: [BreadcrumbsModule, IconDirective, RouterLink],
  providers: [provideIcons({Home})],
  selector: "breadcrumbs-emphasis-demo",
  template: `
    <div class="flex flex-col gap-4">
      <!-- preview -->
      <nav aria-label="Breadcrumbs" emphasis="primary" q-breadcrumbs-root>
        <ol q-breadcrumbs-list>
          <li q-breadcrumb-item>
            <a q-breadcrumb-item-trigger routerLink="/">
              <svg q-breadcrumb-item-icon qIcon="Home"></svg>
              Home
            </a>
          </li>
          <li q-breadcrumb-item>
            <a q-breadcrumb-item-trigger routerLink="/components/overview">
              Components
            </a>
          </li>
          <li aria-current="page" q-breadcrumb-item>Breadcrumbs</li>
        </ol>
      </nav>
      <!-- preview -->

      <nav aria-label="Breadcrumbs" emphasis="neutral" q-breadcrumbs-root>
        <ol q-breadcrumbs-list>
          <li q-breadcrumb-item>
            <a q-breadcrumb-item-trigger routerLink="/">
              <svg q-breadcrumb-item-icon qIcon="Home"></svg>
              Home
            </a>
          </li>
          <li q-breadcrumb-item>
            <a q-breadcrumb-item-trigger routerLink="/components/overview">
              Components
            </a>
          </li>
          <li aria-current="page" q-breadcrumb-item>Breadcrumbs</li>
        </ol>
      </nav>
    </div>
  `,
})
export class BreadcrumbsEmphasisDemo {}
