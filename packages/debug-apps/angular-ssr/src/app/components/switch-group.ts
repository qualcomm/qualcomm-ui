import {Component} from "@angular/core"

import {SwitchGroupCompositeDemo} from "@qualcomm-ui/angular-docs/components+/switch-group+/demos/switch-group-composite-demo"
import {SwitchGroupErrorDemo} from "@qualcomm-ui/angular-docs/components+/switch-group+/demos/switch-group-error-demo"
import {SwitchGroupExplorerDemo} from "@qualcomm-ui/angular-docs/components+/switch-group+/demos/switch-group-explorer-demo"
import {SwitchGroupHintDemo} from "@qualcomm-ui/angular-docs/components+/switch-group+/demos/switch-group-hint-demo"
import {SwitchGroupIndentedDemo} from "@qualcomm-ui/angular-docs/components+/switch-group+/demos/switch-group-indented-demo"
import {SwitchGroupOrientationDemo} from "@qualcomm-ui/angular-docs/components+/switch-group+/demos/switch-group-orientation-demo"
import {SwitchGroupSimpleDemo} from "@qualcomm-ui/angular-docs/components+/switch-group+/demos/switch-group-simple-demo"
import {SwitchGroupSizeDemo} from "@qualcomm-ui/angular-docs/components+/switch-group+/demos/switch-group-size-demo"

@Component({
  imports: [
    SwitchGroupCompositeDemo,
    SwitchGroupErrorDemo,
    SwitchGroupExplorerDemo,
    SwitchGroupHintDemo,
    SwitchGroupIndentedDemo,
    SwitchGroupOrientationDemo,
    SwitchGroupSimpleDemo,
    SwitchGroupSizeDemo,
  ],
  selector: "app-switch-group",
  template: `
    <div class="container">
      <div class="section">
        <h2 class="section-title">Composite</h2>
        <div class="demo-container">
          <switch-group-composite-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Error</h2>
        <div class="demo-container">
          <switch-group-error-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Explorer</h2>
        <div class="demo-container">
          <switch-group-explorer-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Hint</h2>
        <div class="demo-container">
          <switch-group-hint-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Indented</h2>
        <div class="demo-container">
          <switch-group-indented-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Orientation</h2>
        <div class="demo-container">
          <switch-group-orientation-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Simple</h2>
        <div class="demo-container">
          <switch-group-simple-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Size</h2>
        <div class="demo-container">
          <switch-group-size-demo />
        </div>
      </div>
    </div>
  `,
})
export class SwitchGroupPage {}

