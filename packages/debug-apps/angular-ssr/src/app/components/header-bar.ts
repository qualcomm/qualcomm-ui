import {Component} from "@angular/core"

import {HeaderBarExplorerDemo} from "@qualcomm-ui/angular-docs/components+/header-bar+/demos/header-bar-explorer-demo"
import {HeaderBarMenuItemDemo} from "@qualcomm-ui/angular-docs/components+/header-bar+/demos/header-bar-menu-item-demo"
import {HeaderBarPaddingDemo} from "@qualcomm-ui/angular-docs/components+/header-bar+/demos/header-bar-padding-demo"
import {HeaderBarShowcaseDemo} from "@qualcomm-ui/angular-docs/components+/header-bar+/demos/header-bar-showcase-demo"
import {HeaderBarSizesDemo} from "@qualcomm-ui/angular-docs/components+/header-bar+/demos/header-bar-sizes-demo"
import {HeaderBarSurfacesDemo} from "@qualcomm-ui/angular-docs/components+/header-bar+/demos/header-bar-surfaces-demo"

@Component({
  imports: [
    HeaderBarExplorerDemo,
    HeaderBarMenuItemDemo,
    HeaderBarPaddingDemo,
    HeaderBarShowcaseDemo,
    HeaderBarSizesDemo,
    HeaderBarSurfacesDemo,
  ],
  selector: "app-header-bar",
  template: `
    <div class="container">
      <div class="section">
        <h2 class="section-title">Explorer</h2>
        <div class="demo-container">
          <header-bar-explorer-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Menu Item</h2>
        <div class="demo-container">
          <header-bar-menu-item-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Padding</h2>
        <div class="demo-container">
          <header-bar-padding-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Showcase</h2>
        <div class="demo-container">
          <header-bar-showcase-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Sizes</h2>
        <div class="demo-container">
          <header-bar-sizes-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Surfaces</h2>
        <div class="demo-container">
          <header-bar-surfaces-demo />
        </div>
      </div>
    </div>
  `,
})
export class HeaderBarPage {}

