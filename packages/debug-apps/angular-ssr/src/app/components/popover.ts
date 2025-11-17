import {Component} from "@angular/core"

import {PopoverCompositeDemo} from "@qualcomm-ui/angular-docs/components+/popover+/demos/popover-composite-demo"
import {PopoverSimpleDemo} from "@qualcomm-ui/angular-docs/components+/popover+/demos/popover-simple-demo"

@Component({
  imports: [PopoverCompositeDemo, PopoverSimpleDemo],
  selector: "app-popover",
  template: `
    <div
      class="container"
      style="max-width: 1200px; margin: 0 auto; padding: 2rem;"
    >
      <div class="section">
        <h2 class="section-title">Composite</h2>
        <div class="demo-container">
          <popover-composite-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Simple</h2>
        <div class="demo-container">
          <popover-simple-demo />
        </div>
      </div>
    </div>
  `,
})
export class PopoverPage {}
