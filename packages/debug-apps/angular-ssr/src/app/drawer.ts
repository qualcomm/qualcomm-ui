import {Component} from "@angular/core"

import {DrawerControlledStateDemo} from "@qualcomm-ui/angular-docs/components+/drawer+/demos/drawer-controlled-state-demo"
import {DrawerCustomContainerDemo} from "@qualcomm-ui/angular-docs/components+/drawer+/demos/drawer-custom-container-demo"
import {DrawerPlacementDemo} from "@qualcomm-ui/angular-docs/components+/drawer+/demos/drawer-placement-demo"
import {DrawerPlacementStartDemo} from "@qualcomm-ui/angular-docs/components+/drawer+/demos/drawer-placement-start-demo"

@Component({
  imports: [
    DrawerControlledStateDemo,
    DrawerCustomContainerDemo,
    DrawerPlacementDemo,
    DrawerPlacementStartDemo,
  ],
  selector: "app-drawer",
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
        <h2 class="section-title">Controlled State</h2>
        <div class="demo-container">
          <drawer-controlled-state-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Custom Container</h2>
        <div class="demo-container">
          <drawer-custom-container-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Placement</h2>
        <div class="demo-container">
          <drawer-placement-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Placement Start</h2>
        <div class="demo-container">
          <drawer-placement-start-demo />
        </div>
      </div>
    </div>
  `,
})
export class DrawerPage {}
