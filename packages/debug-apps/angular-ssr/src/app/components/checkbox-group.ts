import {Component} from "@angular/core"

import {CheckboxGroupCompositeDemo} from "@qualcomm-ui/angular-docs/components+/checkbox-group+/demos/checkbox-group-composite-demo"
import {CheckboxGroupErrorDemo} from "@qualcomm-ui/angular-docs/components+/checkbox-group+/demos/checkbox-group-error-demo"
import {CheckboxGroupExplorerDemo} from "@qualcomm-ui/angular-docs/components+/checkbox-group+/demos/checkbox-group-explorer-demo"
import {CheckboxGroupHintDemo} from "@qualcomm-ui/angular-docs/components+/checkbox-group+/demos/checkbox-group-hint-demo"
import {CheckboxGroupIndentedDemo} from "@qualcomm-ui/angular-docs/components+/checkbox-group+/demos/checkbox-group-indented-demo"
import {CheckboxGroupOrientationDemo} from "@qualcomm-ui/angular-docs/components+/checkbox-group+/demos/checkbox-group-orientation-demo"
import {CheckboxGroupSimpleDemo} from "@qualcomm-ui/angular-docs/components+/checkbox-group+/demos/checkbox-group-simple-demo"
import {CheckboxGroupSizeDemo} from "@qualcomm-ui/angular-docs/components+/checkbox-group+/demos/checkbox-group-size-demo"

@Component({
  imports: [
    CheckboxGroupCompositeDemo,
    CheckboxGroupErrorDemo,
    CheckboxGroupExplorerDemo,
    CheckboxGroupHintDemo,
    CheckboxGroupIndentedDemo,
    CheckboxGroupOrientationDemo,
    CheckboxGroupSimpleDemo,
    CheckboxGroupSizeDemo,
  ],
  selector: "app-checkbox-group",
  template: `
    <div class="container">
      <div class="section">
        <h2 class="section-title">Composite</h2>
        <div class="demo-container">
          <checkbox-group-composite-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Error</h2>
        <div class="demo-container">
          <checkbox-group-error-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Explorer</h2>
        <div class="demo-container">
          <checkbox-group-explorer-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Hint</h2>
        <div class="demo-container">
          <checkbox-group-hint-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Indented</h2>
        <div class="demo-container">
          <checkbox-group-indented-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Orientation</h2>
        <div class="demo-container">
          <checkbox-group-orientation-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Simple</h2>
        <div class="demo-container">
          <checkbox-group-simple-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Size</h2>
        <div class="demo-container">
          <checkbox-group-size-demo />
        </div>
      </div>
    </div>
  `,
})
export class CheckboxGroupPage {}

