import {Component, computed, inject} from "@angular/core"
import {RouterLink} from "@angular/router"
import {LucideMoon, LucideSun} from "@lucide/angular"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {LinkDirective} from "@qualcomm-ui/angular/link"
import {QdsThemeService} from "@qualcomm-ui/angular/theme"

@Component({
  imports: [RouterLink, LinkDirective, ButtonModule],
  selector: "app-home",
  styles: `
    .app-title {
      font: var(--font-static-heading-lg-default);
      color: var(--color-text-neutral-primary);
    }
  `,
  template: `
    <div class="container">
      <button
        q-button
        [endIcon]="themeIcon()"
        (click)="themeService.toggleTheme()"
      >
        Toggle Theme
      </button>

      <h1 class="app-title">Component Demos</h1>

      <ul class="space-y-2">
        @for (group of groups; track group.path) {
          <li>
            <a q-link [routerLink]="group.path">
              {{ group.name }}
            </a>
          </li>
        }
      </ul>
    </div>
  `,
})
export class Home {
  protected readonly themeService = inject(QdsThemeService)

  readonly themeIcon = computed(() =>
    this.themeService.theme() === "light" ? LucideSun : LucideMoon,
  )

  groups = [
    {name: "Accordion", path: "/accordion"},
    {name: "Alert Banner", path: "/alert-banner"},
    {name: "Avatar", path: "/avatar"},
    {name: "Breadcrumbs", path: "/breadcrumbs"},
    {name: "Button", path: "/button"},
    {name: "Button Group", path: "/button-group"},
    {name: "Card", path: "/card"},
    {name: "Checkbox", path: "/checkbox"},
    {name: "Checkbox Group", path: "/checkbox-group"},
    {name: "Collapsible", path: "/collapsible"},
    {name: "Combobox", path: "/combobox"},
    {name: "Dialog", path: "/dialog"},
    {name: "Divider", path: "/divider"},
    {name: "Drawer", path: "/drawer"},
    {name: "File Input", path: "/file-input"},
    {name: "Header Bar", path: "/header-bar"},
    {name: "Icon", path: "/icon"},
    {name: "Icon Button", path: "/icon-button"},
    {name: "Inline Icon Button", path: "/inline-icon-button"},
    {name: "Inline Notification", path: "/inline-notification"},
    {name: "Link", path: "/link"},
    {name: "Menu", path: "/menu"},
    {name: "Number Input", path: "/number-input"},
    {name: "Pagination", path: "/pagination"},
    {name: "Password Input", path: "/password-input"},
    {name: "Popover", path: "/popover"},
    {name: "Progress", path: "/progress"},
    {name: "Progress Ring", path: "/progress-ring"},
    {name: "Radio", path: "/radio"},
    {name: "Select", path: "/select"},
    {name: "Segmented Control", path: "/segmented-control"},
    {name: "Side Nav", path: "/side-nav"},
    {name: "Slider", path: "/slider"},
    {name: "Stepper", path: "/stepper"},
    {name: "Switch", path: "/switch"},
    {name: "Switch Group", path: "/switch-group"},
    {name: "Tabs", path: "/tabs"},
    {name: "Tag", path: "/tag"},
    {name: "Text Area", path: "/text-area"},
    {name: "Text Input", path: "/text-input"},
    {name: "Toast", path: "/toast"},
    {name: "Tooltip", path: "/tooltip"},
    {name: "Tree", path: "/tree"},
  ]
}
