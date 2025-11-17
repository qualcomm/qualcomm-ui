import {Component} from "@angular/core"

import {TooltipCloseEventsDemo} from "@qualcomm-ui/angular-docs/components+/tooltip+/demos/tooltip-close-events-demo"
import {TooltipCompositeDemo} from "@qualcomm-ui/angular-docs/components+/tooltip+/demos/tooltip-composite-demo"
import {TooltipControlledStateDemo} from "@qualcomm-ui/angular-docs/components+/tooltip+/demos/tooltip-controlled-state-demo"
import {TooltipDisabledDemo} from "@qualcomm-ui/angular-docs/components+/tooltip+/demos/tooltip-disabled-demo"
import {TooltipPlacementDemo} from "@qualcomm-ui/angular-docs/components+/tooltip+/demos/tooltip-placement-demo"
import {TooltipSimpleDemo} from "@qualcomm-ui/angular-docs/components+/tooltip+/demos/tooltip-simple-demo"

@Component({
  imports: [
    TooltipCloseEventsDemo,
    TooltipCompositeDemo,
    TooltipControlledStateDemo,
    TooltipDisabledDemo,
    TooltipPlacementDemo,
    TooltipSimpleDemo,
  ],
  selector: "app-tooltip",
  template: `
    <div class="container">
      <div class="section">
        <h2 class="section-title">Close Events</h2>
        <div class="demo-container">
          <tooltip-close-events-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Composite</h2>
        <div class="demo-container">
          <tooltip-composite-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Controlled State</h2>
        <div class="demo-container">
          <tooltip-controlled-state-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Disabled</h2>
        <div class="demo-container">
          <tooltip-disabled-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Placement</h2>
        <div class="demo-container">
          <tooltip-placement />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Simple</h2>
        <div class="demo-container">
          <tooltip-simple-demo />
        </div>
      </div>
    </div>
  `,
})
export class TooltipPage {}
