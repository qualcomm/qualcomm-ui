import {Component} from "@angular/core"

import {FileInputCompositeDemo} from "@qualcomm-ui/angular-docs/components+/file-input+/demos/file-input-composite-demo"
import {FileInputDisabledDemo} from "@qualcomm-ui/angular-docs/components+/file-input+/demos/file-input-disabled-demo"
import {FileInputErrorsDemo} from "@qualcomm-ui/angular-docs/components+/file-input+/demos/file-input-errors-demo"
import {FileInputSimpleDemo} from "@qualcomm-ui/angular-docs/components+/file-input+/demos/file-input-simple-demo"
import {FileInputSizesDemo} from "@qualcomm-ui/angular-docs/components+/file-input+/demos/file-input-sizes-demo"

@Component({
  imports: [
    FileInputCompositeDemo,
    FileInputDisabledDemo,
    FileInputErrorsDemo,
    FileInputSimpleDemo,
    FileInputSizesDemo,
  ],
  selector: "app-file-input",
  template: `
    <div class="container">
      <div class="section">
        <h2 class="section-title">Composite</h2>
        <div class="demo-container">
          <file-input-composite-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Disabled</h2>
        <div class="demo-container">
          <file-input-disabled-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Errors</h2>
        <div class="demo-container">
          <file-input-errors-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Simple</h2>
        <div class="demo-container">
          <file-input-simple-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Sizes</h2>
        <div class="demo-container">
          <file-input-sizes-demo />
        </div>
      </div>
    </div>
  `,
})
export class FileInputPage {}

