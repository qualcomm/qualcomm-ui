import {Component} from "@angular/core"
import {RouterOutlet} from "@angular/router"

import {QdsThemeProviderComponent} from "@qualcomm-ui/angular/theme"

@Component({
  imports: [RouterOutlet, QdsThemeProviderComponent],
  selector: "app-root",
  template: `
    <qds-theme-provider>
      <router-outlet />
    </qds-theme-provider>
  `,
})
export class App {}
