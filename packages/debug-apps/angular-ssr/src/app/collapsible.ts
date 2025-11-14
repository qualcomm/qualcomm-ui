import {Component} from "@angular/core"

import {CollapsibleControlledDemo} from "@qualcomm-ui/angular-docs/components/collapsible/demos/collapsible-controlled-demo"
import {CollapsibleShowcaseDemo} from "@qualcomm-ui/angular-docs/components/collapsible/demos/collapsible-showcase-demo"

@Component({
  imports: [CollapsibleControlledDemo, CollapsibleShowcaseDemo],
  selector: "app-collapsible",
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
        <h2 class="section-title">Controlled</h2>
        <div class="demo-container">
          <collapsible-controlled-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Showcase</h2>
        <div class="demo-container">
          <collapsible-showcase-demo />
        </div>
      </div>
    </div>
  `,
})
export class CollapsiblePage {}
