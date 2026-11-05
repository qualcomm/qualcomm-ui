import {Component} from "@angular/core"

import {TreeAddRemoveDemo} from "@qualcomm-ui/angular-docs/components+/tree+/demos/tree-add-remove-demo"
import {TreeCheckboxDemo} from "@qualcomm-ui/angular-docs/components+/tree+/demos/tree-checkbox-demo"
import {TreeCheckboxStatePreviewDemo} from "@qualcomm-ui/angular-docs/components+/tree+/demos/tree-checkbox-state-preview-demo"
import {TreeDefaultExpandedDemo} from "@qualcomm-ui/angular-docs/components+/tree+/demos/tree-default-expanded-demo"
import {TreeDisabledNodeDemo} from "@qualcomm-ui/angular-docs/components+/tree+/demos/tree-disabled-node-demo"
import {TreeExplorerDemo} from "@qualcomm-ui/angular-docs/components+/tree+/demos/tree-explorer-demo"
import {TreeFilteringDemo} from "@qualcomm-ui/angular-docs/components+/tree+/demos/tree-filtering-demo"
import {TreeLinksDemo} from "@qualcomm-ui/angular-docs/components+/tree+/demos/tree-links-demo"
import {TreeNodeShorthandDemo} from "@qualcomm-ui/angular-docs/components+/tree+/demos/tree-node-shorthand-demo"
import {TreeNodesDemo} from "@qualcomm-ui/angular-docs/components+/tree+/demos/tree-nodes-demo"
import {TreeSizeDemo} from "@qualcomm-ui/angular-docs/components+/tree+/demos/tree-size-demo"
import {TreeValidStateDemo} from "@qualcomm-ui/angular-docs/components+/tree+/demos/tree-valid-state-demo"

@Component({
  imports: [
    TreeAddRemoveDemo,
    TreeCheckboxDemo,
    TreeCheckboxStatePreviewDemo,
    TreeDefaultExpandedDemo,
    TreeDisabledNodeDemo,
    TreeExplorerDemo,
    TreeFilteringDemo,
    TreeLinksDemo,
    TreeNodeShorthandDemo,
    TreeNodesDemo,
    TreeSizeDemo,
    TreeValidStateDemo,
  ],
  selector: "app-tree",
  template: `
    <div class="container">
      <div class="section">
        <h2 class="section-title">Add and Remove</h2>
        <div class="demo-container">
          <tree-add-remove-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Checkbox</h2>
        <div class="demo-container">
          <tree-checkbox-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Checkbox State Preview</h2>
        <div class="demo-container">
          <tree-checkbox-state-preview-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Default Expanded</h2>
        <div class="demo-container">
          <tree-default-expanded-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Disabled Node</h2>
        <div class="demo-container">
          <tree-disabled-node-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Explorer</h2>
        <div class="demo-container">
          <tree-explorer-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Filtering</h2>
        <div class="demo-container">
          <tree-filtering-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Links</h2>
        <div class="demo-container">
          <tree-links-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Node Shorthand</h2>
        <div class="demo-container">
          <tree-node-shorthand-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Nodes</h2>
        <div class="demo-container">
          <tree-nodes-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Size</h2>
        <div class="demo-container">
          <tree-size-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Valid State</h2>
        <div class="demo-container">
          <tree-valid-state-demo />
        </div>
      </div>
    </div>
  `,
})
export class TreePage {}

