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
  template: `
    <div class="container">
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
