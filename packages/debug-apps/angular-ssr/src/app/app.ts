import {Component, computed, inject} from "@angular/core"
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router"
import {Layers2, Moon, Sun} from "lucide-angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {AvatarModule} from "@qualcomm-ui/angular/avatar"
import {HeaderBarModule} from "@qualcomm-ui/angular/header-bar"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {QdsThemeService} from "@qualcomm-ui/angular/theme"

@Component({
  imports: [
    RouterOutlet,
    HeaderBarModule,
    RouterLinkActive,
    RouterLink,
    IconDirective,
    AvatarModule,
  ],
  providers: [provideIcons({Layers2, Moon, Sun})],
  selector: "app-root",
  template: `
    <div class="flex h-screen flex-col">
      <header class="@container shrink-0" q-header-bar-root>
        <a q-header-bar-logo routerLink="/">
          <div class="rounded-sm p-0.5">
            <svg qIcon="Layers2" size="lg"></svg>
          </div>
          <span q-header-bar-app-title>Qualcomm App</span>
        </a>

        <div q-header-bar-divider></div>

        <nav class="hidden @min-[580px]:flex" q-header-bar-nav>
          <a
            q-header-bar-nav-item
            routerLink="/"
            routerLinkActive="active"
            [active]="true"
            [routerLinkActiveOptions]="{exact: true}"
          >
            Introduction
          </a>
        </nav>

        <div class="hidden @min-[285px]:flex" q-header-bar-action-bar>
          <button
            aria-label="Toggle Theme"
            q-header-bar-action-icon-button
            [icon]="themeIcon()"
            (click)="toggleTheme()"
          ></button>

          <div class="hidden @min-[375px]:block" q-header-bar-divider></div>

          <span
            class="hidden @min-[375px]:flex"
            q-avatar
            size="xs"
            variant="contrast"
          >
            <span q-avatar-content>JD</span>
          </span>
        </div>
      </header>

      <router-outlet />
    </div>
  `,
})
export class App {
  readonly themeIcon = computed(() =>
    this.themeService.theme() === "light" ? "Sun" : "Moon",
  )

  toggleTheme() {
    this.themeService.toggleTheme()
  }

  protected themeService = inject(QdsThemeService)
}
