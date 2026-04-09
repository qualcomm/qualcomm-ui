// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=14492-51514
// component=SideNav

const figma = require("figma")

const instance = figma.selectedInstance

const surface = instance.getEnum("surface", {secondary: "secondary"})
const variant = instance.getEnum("variant", {collapsed: "collapsed"})

const openAttr = variant === "collapsed" ? ` [open]="false"` : ""
const surfaceAttr = surface ? ` surface="${surface}"` : ""

export default {
  example: figma.code`
    <!-- Create and pass a TreeCollection instance from your component class. -->
    <nav q-side-nav-root [collection]="collection"${openAttr}${surfaceAttr}>
      <header q-side-nav-header>
        <div q-side-nav-header-logo>
          <!-- Logo -->
        </div>
        <div q-side-nav-header-title>Qualcomm</div>
        <button q-side-nav-collapse-trigger></button>
      </header>

      <div q-side-nav-group>
        <div q-side-nav-divider></div>
        <div q-side-nav-group-label>Group Title</div>
        <!-- Render q-side-nav-nodes or individual side-nav nodes here. -->
      </div>
    </nav>`,
  id: "SideNav",
  imports: [
    `import {SideNavModule} from "@qualcomm-ui/angular/side-nav"`,
    `import {createTreeCollection} from "@qualcomm-ui/core/tree"`,
  ],
  metadata: {nestable: true},
}
