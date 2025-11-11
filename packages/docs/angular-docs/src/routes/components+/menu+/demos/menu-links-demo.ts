import {Component} from "@angular/core"
import {RouterLink} from "@angular/router"
import {ExternalLink} from "lucide-angular"

import {MenuModule} from "@qualcomm-ui/angular/menu"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {PortalComponent} from "@qualcomm-ui/angular-core/portal"

@Component({
  imports: [MenuModule, PortalComponent, RouterLink],
  providers: [provideIcons({ExternalLink})],
  selector: "menu-links-demo",
  template: `
    <q-menu>
      <button emphasis="primary" q-menu-button variant="fill">Show Menu</button>
      <q-portal>
        <div q-menu-positioner>
          <!-- preview -->
          <div q-menu-content>
            <a
              href="https://angular.dev"
              q-menu-item
              target="_blank"
              value="angular-dev"
            >
              <div icon="ExternalLink" q-menu-item-start-icon></div>
              angular.dev
            </a>
            <a
              fragment="links"
              q-menu-item
              routerLink="/components/menu"
              value="menu-links-demo"
            >
              Menu Links Demo
            </a>
          </div>
          <!-- preview -->
        </div>
      </q-portal>
    </q-menu>
  `,
})
export class MenuLinksDemo {}
