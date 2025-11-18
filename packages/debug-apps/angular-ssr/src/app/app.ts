import {Component, inject} from "@angular/core"
import {RouterOutlet} from "@angular/router"

import {QdsThemeService} from "@qualcomm-ui/angular/theme"

@Component({
  imports: [RouterOutlet],
  selector: "app-root",
  template: `
    <router-outlet />
  `,
})
export class App {
  protected themeService = inject(QdsThemeService)
}
