import {Component} from "@angular/core"
import {RouterLink} from "@angular/router"
import {Home} from "lucide-angular"

import {BreadcrumbsModule} from "@qualcomm-ui/angular/breadcrumbs"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [BreadcrumbsModule, IconDirective, RouterLink],
  providers: [provideIcons({Home})],
  selector: "breadcrumbs-links-demo",
  template: `
    <!-- preview -->
    <nav aria-label="Breadcrumbs" q-breadcrumbs-root>
      <ol q-breadcrumbs-list>
        <li q-breadcrumb-item>
          <a q-breadcrumb-item-trigger routerLink="/">
            <svg q-breadcrumb-item-icon qIcon="Home"></svg>
            Home
          </a>
        </li>
        <li disabled q-breadcrumb-item>
          <a routerLink="/components">Components</a>
        </li>
        <li q-breadcrumb-item>
          <a
            aria-current="page"
            q-breadcrumb-item-trigger
            routerLink="/components/breadcrumbs"
          >
            Breadcrumbs
          </a>
        </li>
      </ol>
    </nav>
    <!-- preview -->
  `,
})
export class BreadcrumbsLinksDemo {}
