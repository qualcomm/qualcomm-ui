import {Component} from "@angular/core"

import {IconProviderDemo} from "@qualcomm-ui/angular-docs/components+/icon+/demos/icon-provider-demo"
import {IconSizesDemo} from "@qualcomm-ui/angular-docs/components+/icon+/demos/icon-sizes-demo"

@Component({
  imports: [IconProviderDemo, IconSizesDemo],
  template: `
    <div
      class="container"
      style="max-width: 1200px; margin: 0 auto; padding: 2rem;"
    >
      <div class="section">
        <h2 class="section-title">Provider</h2>
        <div class="demo-container">
          <icon-provider-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Sizes</h2>
        <div class="demo-container">
          <icon-sizes-demo />
        </div>
      </div>
    </div>
  `,
})
export class IconPage {}
