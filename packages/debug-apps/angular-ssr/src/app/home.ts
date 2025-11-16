import {Component} from "@angular/core"
import {RouterLink} from "@angular/router"

import {LinkDirective} from "@qualcomm-ui/angular/link"

@Component({
  imports: [RouterLink, LinkDirective],
  selector: "app-home",
  styles: `
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .app-title {
      font: var(--font-static-heading-lg-default);
      color: var(--color-text-neutral-primary);
    }

    .intro {
      font-size: 1.125rem;
      color: var(--color-text-neutral-secondary);
      margin-bottom: 2rem;
    }

    .components-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }
  `,
  template: `
    <div class="container">
      <h1 class="app-title">Component Demos</h1>

      <div class="components-grid">
        @for (group of groups; track group.path) {
          <a q-link [routerLink]="group.path">
            {{ group.name }}
          </a>
        }
      </div>
    </div>
  `,
})
export class Home {
  groups = [
    {name: "Accordion", path: "/accordion"},
    {name: "Avatar", path: "/avatar"},
    {name: "Breadcrumbs", path: "/breadcrumbs"},
    {name: "Button", path: "/button"},
    {name: "Button Group", path: "/button-group"},
    {name: "Checkbox", path: "/checkbox"},
    {name: "Collapsible", path: "/collapsible"},
    {name: "Combobox", path: "/combobox"},
    {name: "Dialog", path: "/dialog"},
    {name: "Divider", path: "/divider"},
    {name: "Drawer", path: "/drawer"},
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
    {name: "Switch", path: "/switch"},
    {name: "Tabs", path: "/tabs"},
    {name: "Tag", path: "/tag"},
    {name: "Text Input", path: "/text-input"},
    {name: "Toast", path: "/toast"},
    {name: "Tooltip", path: "/tooltip"},
  ]
}
