import {Component} from "@angular/core"

import {ButtonGroupLayoutDemo} from "@qualcomm-ui/angular-docs/components+/button-group+/demos/button-group-layout-demo"
import {ButtonGroupSharedPropsDemo} from "@qualcomm-ui/angular-docs/components+/button-group+/demos/button-group-shared-props-demo"

@Component({
  imports: [ButtonGroupLayoutDemo, ButtonGroupSharedPropsDemo],
  selector: "app-button-group",
  template: `
    <div class="container">
      <div class="section">
        <h2 class="section-title">Layout</h2>
        <div class="demo-container">
          <button-group-layout-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Shared Props</h2>
        <div class="demo-container">
          <button-group-shared-props-demo />
        </div>
      </div>
    </div>
  `,
})
export class ButtonGroupPage {}
