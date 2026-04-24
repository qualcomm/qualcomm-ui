// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=14834-655454
// component=SideNavItem

const figma = require("figma")

const instance = figma.selectedInstance

const variant = instance.getEnum("variant", {dropdown: "dropdown"})

let example

if (variant === "dropdown") {
  example = figma.code`
    <div q-side-nav-branch>
      <div q-side-nav-branch-node>
        <div q-side-nav-node-indicator></div>
        <svg q-side-nav-node-icon qIcon="Rocket"></svg>
        <span q-side-nav-node-text>Menu item</span>
        <div q-side-nav-branch-trigger></div>
      </div>
      <div q-side-nav-branch-content>
        <!-- Child nodes -->
      </div>
    </div>`
}

if (!variant) {
  example = figma.code`
    <div q-side-nav-leaf-node>
      <div q-side-nav-node-indicator></div>
      <svg q-side-nav-node-icon qIcon="Rocket"></svg>
      <span q-side-nav-node-text>Menu item</span>
    </div>`
}

export default {
  example,
  id: "SideNavItem",
  imports: [
    `import {SideNavModule} from "@qualcomm-ui/angular/side-nav"`,
    `import {IconDirective} from "@qualcomm-ui/angular/icon"`,
    `import {Rocket} from "lucide-angular"`,
  ],
  metadata: {nestable: true},
}
