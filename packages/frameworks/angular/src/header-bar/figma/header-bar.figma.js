// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=14622-42103
// component=HeaderBar

const figma = require("figma")

const instance = figma.selectedInstance

const padding = instance.getEnum("padding", {large: "large"})
const size = instance.getEnum("size", {lg: "lg"})
const surface = instance.getEnum("surface", {secondary: "secondary"})
const showLogo = instance.getBoolean("logo")
const navigation = instance.getBoolean("navigation")
const actionBar = instance.getBoolean("actionBar")
const windowsMenu = instance.getBoolean("windowsMenu")

const paddingAttr = padding ? ` padding="${padding}"` : ""
const sizeAttr = size ? ` size="${size}"` : ""
const surfaceAttr = surface ? ` surface="${surface}"` : ""

let logoEl = ""
let logoDividerEl = ""
if (showLogo) {
  const logo = instance.findInstance("_Header logo")
  const appTitle = logo.getBoolean("name")
  const divider = logo.getBoolean("divider")

  const appTitleEl = appTitle
    ? `<div q-header-bar-app-title>Qualcomm AI Runtime</div>`
    : ""
  logoEl = `
      <div q-header-bar-logo>
        <!-- Logo icon -->
        ${appTitleEl}
      </div>`
  logoDividerEl = divider ? `<div q-header-bar-divider></div>` : ""
}

const navEl = navigation
  ? `
      <nav q-header-bar-nav>
        <button q-header-bar-nav-item>Home</button>
        <button q-header-bar-nav-item>Automated Jobs</button>
        <q-menu>
          <button q-header-bar-menu-item q-menu-trigger>Remote Sessions</button>
          <q-portal>
            <div q-menu-positioner>
              <div q-menu-content>
                <button q-menu-item value="option1">
                  <div q-menu-item-label>Option 1</div>
                </button>
                <button q-menu-item value="option2">
                  <div q-menu-item-label>Option 2</div>
                </button>
              </div>
            </div>
          </q-portal>
        </q-menu>
        <button q-header-bar-nav-item>Minutes</button>
        <button q-header-bar-nav-item>FAQ</button>
      </nav>`
  : ""

const actionBarEl = actionBar
  ? `
      <div q-header-bar-action-bar>
        <button icon="Search" q-header-bar-action-icon-button></button>
        <div q-header-bar-divider></div>
        <button icon="Moon" q-header-bar-action-icon-button></button>
        <button icon="Settings" q-header-bar-action-icon-button></button>
        <button q-header-bar-action-button startIcon="LayoutGrid">Apps</button>
        <div q-header-bar-divider></div>
        <div q-avatar emphasis="contrast" size="xs" status="active">
          <div q-avatar-content>
            <svg aria-label="User" qIcon="User"></svg>
          </div>
          <div q-avatar-status></div>
        </div>
      </div>`
  : ""

const windowControlsEl = windowsMenu
  ? `<div q-header-bar-window-controls></div>`
  : ""

export default {
  example: figma.code`
    <div q-header-bar-root${paddingAttr}${sizeAttr}${surfaceAttr}>
      ${logoEl}
      ${logoDividerEl}
      ${navEl}
      ${actionBarEl}
      ${windowControlsEl}
    </div>`,
  id: "HeaderBar",
  imports: [
    `import {HeaderBarModule} from "@qualcomm-ui/angular/header-bar"`,
    ...(navigation
      ? [
          `import {MenuModule} from "@qualcomm-ui/angular/menu"`,
          `import {PortalComponent} from "@qualcomm-ui/angular-core/portal"`,
        ]
      : []),
    ...(actionBar
      ? [`import {AvatarModule} from "@qualcomm-ui/angular/avatar"`]
      : []),
    ...(showLogo || actionBar
      ? [`import {IconDirective} from "@qualcomm-ui/angular/icon"`]
      : []),
    ...(actionBar
      ? [
          `import {LayoutGrid, Moon, Search, Settings, User} from "@lucide/angular"`,
        ]
      : []),
  ],
  metadata: {nestable: true},
}
