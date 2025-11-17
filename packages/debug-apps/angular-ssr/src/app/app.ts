import {Component, inject} from "@angular/core"
import {RouterOutlet} from "@angular/router"

import {QdsThemeService} from "@qualcomm-ui/angular/theme"

@Component({
  host: {
    "[attr.data-brand]": "themeService.brand()",
    "[attr.data-theme]": "themeService.theme()",
  },
  imports: [RouterOutlet],
  selector: "app-root",
  template: `
    <router-outlet />
  `,
})
export class App {
  protected readonly themeService = inject(QdsThemeService)
}
