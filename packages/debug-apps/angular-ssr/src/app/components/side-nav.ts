import {Component, ViewEncapsulation} from "@angular/core"

import {SideNavCollapsedDemo} from "@qualcomm-ui/angular-docs/components+/side-nav+/demos/side-nav-collapsed-demo"
import {SideNavDefaultExpandedDemo} from "@qualcomm-ui/angular-docs/components+/side-nav+/demos/side-nav-default-expanded-demo"
import {SideNavDisabledNodeDemo} from "@qualcomm-ui/angular-docs/components+/side-nav+/demos/side-nav-disabled-node-demo"
import {SideNavFilteringDemo} from "@qualcomm-ui/angular-docs/components+/side-nav+/demos/side-nav-filtering-demo"
import {SideNavGroupsDemo} from "@qualcomm-ui/angular-docs/components+/side-nav+/demos/side-nav-groups-demo"
import {SideNavLinksDemo} from "@qualcomm-ui/angular-docs/components+/side-nav+/demos/side-nav-links-demo"
import {SideNavNodeShorthandDemo} from "@qualcomm-ui/angular-docs/components+/side-nav+/demos/side-nav-node-shorthand-demo"
import {SideNavSurfaceDemo} from "@qualcomm-ui/angular-docs/components+/side-nav+/demos/side-nav-surface-demo"
import {SideNavTooltipDemo} from "@qualcomm-ui/angular-docs/components+/side-nav+/demos/side-nav-tooltip-demo"

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    SideNavNodeShorthandDemo,
    SideNavGroupsDemo,
    SideNavFilteringDemo,
    SideNavLinksDemo,
    SideNavDisabledNodeDemo,
    SideNavDefaultExpandedDemo,
    SideNavSurfaceDemo,
    SideNavTooltipDemo,
    SideNavCollapsedDemo,
  ],
  selector: "app-side-nav",
  template: `
    <div class="container">
      <div class="section">
        <h2 class="section-title">Node Shorthand</h2>
        <div class="demo-container">
          <side-nav-node-shorthand-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Groups</h2>
        <div class="demo-container">
          <side-nav-groups-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Filtering</h2>
        <div class="demo-container">
          <side-nav-filtering-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Links</h2>
        <div class="demo-container">
          <side-nav-links-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Disabled Node</h2>
        <div class="demo-container">
          <side-nav-disabled-node-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Default Expanded</h2>
        <div class="demo-container">
          <side-nav-default-expanded-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Surface</h2>
        <div class="demo-container">
          <side-nav-surface-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Tooltip</h2>
        <div class="demo-container">
          <side-nav-tooltip-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Collapsed</h2>
        <div class="demo-container">
          <side-nav-collapsed-demo />
        </div>
      </div>
    </div>
  `,
})
export class SideNavPage {}