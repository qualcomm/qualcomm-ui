import {Component} from "@angular/core"

import {MenuAnchorPointDemo} from "@qualcomm-ui/angular-docs/components+/menu+/demos/menu-anchor-point-demo"
import {MenuAvatarDemo} from "@qualcomm-ui/angular-docs/components+/menu+/demos/menu-avatar-demo"
import {MenuCheckboxItemsDemo} from "@qualcomm-ui/angular-docs/components+/menu+/demos/menu-checkbox-items-demo"
import {MenuCheckboxStateDemo} from "@qualcomm-ui/angular-docs/components+/menu+/demos/menu-checkbox-state-demo"
import {MenuContextMenuDemo} from "@qualcomm-ui/angular-docs/components+/menu+/demos/menu-context-menu-demo"
import {MenuControlledStateDemo} from "@qualcomm-ui/angular-docs/components+/menu+/demos/menu-controlled-state-demo"
import {MenuHideWhenDetachedDemo} from "@qualcomm-ui/angular-docs/components+/menu+/demos/menu-hide-when-detached-demo"
import {MenuItemCustomizationDemo} from "@qualcomm-ui/angular-docs/components+/menu+/demos/menu-item-customization-demo"
import {MenuLinksDemo} from "@qualcomm-ui/angular-docs/components+/menu+/demos/menu-links-demo"
import {MenuNestedDemo} from "@qualcomm-ui/angular-docs/components+/menu+/demos/menu-nested-demo"
import {MenuPlacementDemo} from "@qualcomm-ui/angular-docs/components+/menu+/demos/menu-placement-demo"
import {MenuRadioGroupDemo} from "@qualcomm-ui/angular-docs/components+/menu+/demos/menu-radio-group-demo"
import {MenuRadioGroupStateDemo} from "@qualcomm-ui/angular-docs/components+/menu+/demos/menu-radio-group-state-demo"
import {MenuWithinDialogDemo} from "@qualcomm-ui/angular-docs/components+/menu+/demos/menu-within-dialog-demo"

@Component({
  imports: [
    MenuAnchorPointDemo,
    MenuAvatarDemo,
    MenuCheckboxItemsDemo,
    MenuCheckboxStateDemo,
    MenuContextMenuDemo,
    MenuControlledStateDemo,
    MenuHideWhenDetachedDemo,
    MenuItemCustomizationDemo,
    MenuLinksDemo,
    MenuNestedDemo,
    MenuPlacementDemo,
    MenuRadioGroupDemo,
    MenuRadioGroupStateDemo,
    MenuWithinDialogDemo,
  ],
  template: `
    <div
      class="container"
      style="max-width: 1200px; margin: 0 auto; padding: 2rem;"
    >
      <div class="section">
        <h2 class="section-title">Anchor Point</h2>
        <div class="demo-container">
          <menu-anchor-point-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Avatar</h2>
        <div class="demo-container">
          <menu-avatar-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Checkbox Items</h2>
        <div class="demo-container">
          <menu-checkbox-items-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Checkbox State</h2>
        <div class="demo-container">
          <menu-checkbox-state-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Context Menu</h2>
        <div class="demo-container">
          <menu-context-menu-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Controlled State</h2>
        <div class="demo-container">
          <menu-controlled-state-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Hide When Detached</h2>
        <div class="demo-container">
          <menu-hide-when-detached-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Item Customization</h2>
        <div class="demo-container">
          <menu-item-customization-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Links</h2>
        <div class="demo-container">
          <menu-links-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Nested</h2>
        <div class="demo-container">
          <menu-nested-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Placement</h2>
        <div class="demo-container">
          <menu-placement-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Radio Group</h2>
        <div class="demo-container">
          <menu-radio-group-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Radio Group State</h2>
        <div class="demo-container">
          <menu-radio-group-state-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Within Dialog</h2>
        <div class="demo-container">
          <menu-within-dialog-demo />
        </div>
      </div>
    </div>
  `,
})
export class MenuPage {}
