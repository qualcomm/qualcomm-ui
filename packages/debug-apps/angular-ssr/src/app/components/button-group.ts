import {Component} from "@angular/core"

import {ButtonGroupLayoutDemo} from "@qualcomm-ui/angular-docs/components+/button-group+/demos/button-group-layout-demo"
import {ButtonGroupSharedPropsDemo} from "@qualcomm-ui/angular-docs/components+/button-group+/demos/button-group-shared-props-demo"

@Component({
  imports: [ButtonGroupLayoutDemo, ButtonGroupSharedPropsDemo],
  template: `
    <div
      class="container"
      style="max-width: 1200px; margin: 0 auto; padding: 2rem;"
    >
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
