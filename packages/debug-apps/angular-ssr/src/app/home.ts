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
      <h1>QUI Angular Components</h1>
      <p class="intro">
        Browse all available components in the Qualcomm UI Angular library,
        organized by category.
      </p>

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
    {name: "Buttons", path: "/buttons"},
    {name: "Data Display", path: "/data-display"},
    {name: "Disclosure", path: "/disclosure"},
    {name: "Feedback", path: "/feedback"},
    {name: "Form Controls", path: "/form-controls"},
    {name: "Overlays", path: "/overlays"},
  ]
}
