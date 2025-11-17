import {Component} from "@angular/core"
import {RouterOutlet} from "@angular/router"

import {QdsThemeProviderComponent} from "@qualcomm-ui/angular/theme"

@Component({
  imports: [RouterOutlet, QdsThemeProviderComponent],
  selector: "app-root",
  styles: [
    `
      .app-container {
        background-color: var(--color-background-neutral-01);
        color: var(--color-text-neutral-primary);
      }
    `,
  ],
  template: `
    <qds-theme-provider>
      <div class="app-container" style="color-scheme: light">
        <router-outlet />
      </div>
    </qds-theme-provider>
  `,
})
export class App {}
