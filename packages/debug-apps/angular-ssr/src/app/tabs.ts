import {Component} from "@angular/core"

import {TabsAddRemoveDemo} from "@qualcomm-ui/angular-docs/components/tabs/demos/tabs-add-remove-demo"
import {TabsContainedSizesDemo} from "@qualcomm-ui/angular-docs/components/tabs/demos/tabs-contained-sizes-demo"
import {TabsContextDemo} from "@qualcomm-ui/angular-docs/components/tabs/demos/tabs-context-demo"
import {TabsControlledValueDemo} from "@qualcomm-ui/angular-docs/components/tabs/demos/tabs-controlled-value-demo"
import {TabsDisabledDemo} from "@qualcomm-ui/angular-docs/components/tabs/demos/tabs-disabled-demo"
import {TabsHorizontalDemo} from "@qualcomm-ui/angular-docs/components/tabs/demos/tabs-horizontal-demo"
import {TabsIconsDemo} from "@qualcomm-ui/angular-docs/components/tabs/demos/tabs-icons-demo"
import {TabsLineSizesDemo} from "@qualcomm-ui/angular-docs/components/tabs/demos/tabs-line-sizes-demo"
import {TabsLinksDemo} from "@qualcomm-ui/angular-docs/components/tabs/demos/tabs-links-demo"
import {TabsVerticalDemo} from "@qualcomm-ui/angular-docs/components/tabs/demos/tabs-vertical-demo"

@Component({
  imports: [TabsAddRemoveDemo, TabsContainedSizesDemo, TabsContextDemo, TabsControlledValueDemo, TabsDisabledDemo, TabsHorizontalDemo, TabsIconsDemo, TabsLineSizesDemo, TabsLinksDemo, TabsVerticalDemo],
  selector: "app-tabs",
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
        <h2 class="section-title">Add Remove</h2>
        <div class="demo-container">
          <tabs-add-remove-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Contained Sizes</h2>
        <div class="demo-container">
          <tabs-contained-sizes-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Context</h2>
        <div class="demo-container">
          <tabs-context-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Controlled Value</h2>
        <div class="demo-container">
          <tabs-controlled-value-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Disabled</h2>
        <div class="demo-container">
          <tabs-disabled-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Horizontal</h2>
        <div class="demo-container">
          <tabs-horizontal-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Icons</h2>
        <div class="demo-container">
          <tabs-icons-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Line Sizes</h2>
        <div class="demo-container">
          <tabs-line-sizes-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Links</h2>
        <div class="demo-container">
          <tabs-links-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Vertical</h2>
        <div class="demo-container">
          <tabs-vertical-demo />
        </div>
      </div>
    </div>
  `,
})
export class TabsPage {}
