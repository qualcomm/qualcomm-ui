import {Component} from "@angular/core"
import {RouterLink} from "@angular/router"
import {LucideHouse} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {BreadcrumbsModule} from "@qualcomm-ui/angular/breadcrumbs"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {MenuModule} from "@qualcomm-ui/angular/menu"

@Component({
  imports: [BreadcrumbsModule, IconDirective, MenuModule, RouterLink],
  providers: [provideIcons({LucideHouse})],
  selector: "breadcrumbs-overflow-demo",
  template: `
    <nav aria-label="Breadcrumbs" q-breadcrumbs-root>
      <ol q-breadcrumbs-list>
        <li q-breadcrumb-item>
          <a q-breadcrumb-item-trigger routerLink="/">
            <svg q-breadcrumb-item-icon qIcon="House"></svg>
            Home
          </a>
        </li>
        <!-- preview -->
        <li q-breadcrumb-overflow-item>
          <a q-menu-item routerLink="/settings" value="settings">Settings</a>
          <a q-menu-item routerLink="/settings/account" value="account">
            Account
          </a>
        </li>
        <!-- preview -->
        <li q-breadcrumb-item>
          <a q-breadcrumb-item-trigger routerLink="/settings/account/security">
            Security
          </a>
        </li>
        <li aria-current="page" q-breadcrumb-item>Sessions</li>
      </ol>
    </nav>
  `,
})
export class BreadcrumbsOverflowDemo {}
