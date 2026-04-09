import {Component} from "@angular/core"
import {Home} from "lucide-angular"

import {BreadcrumbsModule} from "@qualcomm-ui/angular/breadcrumbs"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {MenuModule} from "@qualcomm-ui/angular/menu"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [BreadcrumbsModule, IconDirective, MenuModule],
  providers: [provideIcons({Home})],
  selector: "breadcrumbs-overflow-demo",
  template: `
    <nav aria-label="Breadcrumbs" q-breadcrumbs-root>
      <ol q-breadcrumbs-list>
        <li q-breadcrumb-item>
          <a href="/" q-breadcrumb-item-trigger>
            <svg q-breadcrumb-item-icon qIcon="Home"></svg>
            Home
          </a>
        </li>
        <!-- preview -->
        <li q-breadcrumb-overflow-item>
          <a href="/settings" q-menu-item value="settings">Settings</a>
          <a href="/settings/account" q-menu-item value="account">Account</a>
        </li>
        <!-- preview -->
        <li q-breadcrumb-item>
          <a href="/settings/account/security" q-breadcrumb-item-trigger>
            Security
          </a>
        </li>
        <li aria-current="page" q-breadcrumb-item>Sessions</li>
      </ol>
    </nav>
  `,
})
export class BreadcrumbsOverflowDemo {}
