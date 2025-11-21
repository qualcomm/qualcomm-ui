import {Component, computed, inject} from "@angular/core"
import {Moon, Sun} from "lucide-angular"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {QdsThemeService} from "@qualcomm-ui/angular/theme"

@Component({
  imports: [ButtonModule],
  selector: "force-theme-demo",
  template: `
    <div class="flex flex-col gap-4">
      <!-- preview -->
      <div class="dark" data-brand="qualcomm" data-theme="dark">
        <div
          class="border-neutral-03 bg-neutral-01 flex w-full rounded-sm border px-3 py-2"
        >
          <span class="text-neutral-primary">
            This section will always feature the dark theme regardless of the
            active theme.
          </span>
        </div>
      </div>
      <!-- preview -->
      <div class="flex justify-center">
        <button
          emphasis="primary"
          id="qds-theme-switcher-demo-1"
          q-button
          variant="fill"
          [endIcon]="themeIcon()"
          (click)="themeService.toggleTheme()"
        >
          Toggle Site Theme
        </button>
      </div>
    </div>
  `,
})
export class ForceThemeDemo {
  protected readonly themeService = inject(QdsThemeService)

  protected readonly themeIcon = computed(() =>
    this.themeService.theme() === "light" ? Sun : Moon,
  )
}
