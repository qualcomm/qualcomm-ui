import {NgTemplateOutlet} from "@angular/common"
import {Component} from "@angular/core"
import {
  LucideLayers2,
  LucideLayoutGrid,
  LucideMoon,
  LucideSettings,
} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {AvatarModule} from "@qualcomm-ui/angular/avatar"
import {HeaderBarModule} from "@qualcomm-ui/angular/header-bar"
import {IconDirective} from "@qualcomm-ui/angular/icon"

@Component({
  imports: [HeaderBarModule, AvatarModule, IconDirective, NgTemplateOutlet],
  providers: [
    provideIcons({LucideLayers2, LucideLayoutGrid, LucideMoon, LucideSettings}),
  ],
  selector: "header-bar-surfaces-demo",
  template: `
    <div class="flex w-full flex-col gap-4">
      <ng-container *ngTemplateOutlet="headerBar" />
      <ng-container
        *ngTemplateOutlet="headerBar; context: {surface: 'secondary'}"
      />
    </div>

    <ng-template #headerBar let-surface="surface">
      <div class="@container" q-header-bar-root [surface]="surface">
        <div q-header-bar-logo>
          <div class="bg-category-1-subtle rounded-sm p-0.5">
            <svg qIcon="Layers2" size="lg"></svg>
          </div>
          <div q-header-bar-app-title>Qualcomm AI Visualizer</div>
        </div>

        <div q-header-bar-divider></div>

        <nav class="hidden @min-[580px]:flex" q-header-bar-nav>
          <button q-header-bar-nav-item>Home</button>
          <button q-header-bar-nav-item>
            <svg qIcon="Settings"></svg>
            Settings
          </button>
        </nav>

        <div class="hidden @min-[285px]:flex" q-header-bar-action-bar>
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
          <button
            class="hidden @min-[450px]:inline-flex"
            q-header-bar-action-button
            startIcon="LayoutGrid"
          >
            Apps
          </button>

          <div class="hidden @min-[375px]:block" q-header-bar-divider></div>

          <div
            class="hidden @min-[375px]:flex"
            q-avatar
            size="xs"
            variant="contrast"
          >
            <div q-avatar-content>JD</div>
          </div>
        </div>
      </div>
    </ng-template>
  `,
})
export class HeaderBarSurfacesDemo {}
