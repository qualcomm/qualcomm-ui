import {Component, computed, inject} from "@angular/core"
import {Moon, Sun} from "lucide-angular"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {QdsThemeService} from "@qualcomm-ui/angular/theme"

@Component({
  imports: [ButtonModule],
  selector: "theme-switching-demo",
  template: `
    <div class="flex justify-center">
      <!-- preview -->
      <button
        emphasis="primary"
        id="qds-theme-switcher-demo-2"
        q-button
        variant="fill"
        [endIcon]="themeIcon()"
        (click)="themeService.toggleTheme()"
      >
        Toggle Site Theme
      </button>
      <!-- preview -->
    </div>
  `,
})
export class ThemeSwitchingDemo {
  protected readonly themeService = inject(QdsThemeService)

  protected readonly themeIcon = computed(() =>
    this.themeService.theme() === "light" ? Sun : Moon,
  )
}
