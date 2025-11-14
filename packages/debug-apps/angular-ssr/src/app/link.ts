import {Component} from "@angular/core"

import {LinkColorsDemo} from "@qualcomm-ui/angular-docs/components/link/demos/link-colors-demo"
import {LinkDisabledDemo} from "@qualcomm-ui/angular-docs/components/link/demos/link-disabled-demo"
import {LinkIconsDemo} from "@qualcomm-ui/angular-docs/components/link/demos/link-icons-demo"
import {LinkSizesDemo} from "@qualcomm-ui/angular-docs/components/link/demos/link-sizes-demo"

@Component({
  imports: [LinkColorsDemo, LinkDisabledDemo, LinkIconsDemo, LinkSizesDemo],
  selector: "app-link",
  styles: `
    .section {
      margin-bottom: 3rem;
    }

    .section-title {
      font: var(--font-static-heading-md-default);
      margin-bottom: 1rem;
      color: var(--color-text-neutral-primary);
    }

    .demo-container {
      padding: 2rem;
      border: 1px solid var(--color-border-neutral-01);
      border-radius: 8px;
      background-color: var(--color-background-neutral-01);
    }
  `,
  template: `
    <div
      class="container"
      style="max-width: 1200px; margin: 0 auto; padding: 2rem;"
    >
      <div class="section">
        <h2 class="section-title">Colors</h2>
        <div class="demo-container">
          <link-colors-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Disabled</h2>
        <div class="demo-container">
          <link-disabled-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Icons</h2>
        <div class="demo-container">
          <link-icons-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Sizes</h2>
        <div class="demo-container">
          <link-sizes-demo />
        </div>
      </div>
    </div>
  `,
})
export class LinkPage {}
