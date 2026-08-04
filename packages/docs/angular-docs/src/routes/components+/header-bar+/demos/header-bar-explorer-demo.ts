import {Component} from "@angular/core"
import {Layers2, Moon, Settings} from "lucide-angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {HeaderBarModule} from "@qualcomm-ui/angular/header-bar"
import {IconDirective} from "@qualcomm-ui/angular/icon"

@Component({
  imports: [HeaderBarModule, IconDirective],
  providers: [provideIcons({Layers2, Moon, Settings})],
  selector: "header-bar-explorer-demo",
  template: `
    <div q-header-bar-root>
      <div q-header-bar-logo>
        <svg qIcon="Layers2" size="lg"></svg>
        <div q-header-bar-app-title>App Name</div>
      </div>
      <div q-header-bar-divider></div>
      <nav q-header-bar-nav>
        <button q-header-bar-nav-item>Home</button>
        <button q-header-bar-nav-item>Settings</button>
      </nav>
      <div q-header-bar-action-bar>
        <button
          aria-label="Toggle theme"
          icon="Moon"
          q-header-bar-action-icon-button
        ></button>
        <button
          aria-label="Open settings"
          icon="Settings"
          q-header-bar-action-icon-button
        ></button>
      </div>
    </div>
  `,
})
export class HeaderBarExplorerDemo {}
