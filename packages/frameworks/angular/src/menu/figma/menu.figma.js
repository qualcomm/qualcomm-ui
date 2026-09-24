// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=9054-20157
// component=Menu

const figma = require("figma")

const instance = figma.selectedInstance

const size = instance.getEnum("size", {sm: "sm"})
const section2 = instance.getBoolean("section2")
const section3 = instance.getBoolean("section3")

const sizeAttr = size ? ` size="${size}"` : ""

const checkboxSectionEl = section2
  ? `
      <hr q-menu-separator />
      <div q-menu-item-group>
        <label q-menu-item-group-label>Title name</label>
        <button defaultChecked q-menu-checkbox-item value="checkbox-1">
          <div q-menu-item-label>Checkbox label</div>
          <div q-menu-item-indicator></div>
        </button>
        <button q-menu-checkbox-item value="checkbox-2">
          <div q-menu-item-label>Checkbox label</div>
          <div q-menu-item-indicator></div>
        </button>
        <button q-menu-checkbox-item value="checkbox-3">
          <div q-menu-item-label>Checkbox label</div>
          <div q-menu-item-indicator></div>
        </button>
      </div>`
  : ""

const radioSectionEl = section3
  ? `
      <hr q-menu-separator />
      <div q-menu-radio-item-group defaultValue="radio-1">
        <label q-menu-item-group-label>Title name</label>
        <button q-menu-radio-item value="radio-1">
          <div q-menu-item-label>Radio button label</div>
          <div q-menu-item-indicator></div>
        </button>
        <button q-menu-radio-item value="radio-2">
          <div q-menu-item-label>Radio button label</div>
          <div q-menu-item-indicator></div>
        </button>
        <button q-menu-radio-item value="radio-3">
          <div q-menu-item-label>Radio button label</div>
          <div q-menu-item-indicator></div>
        </button>
      </div>`
  : ""

export default {
  example: figma.code`
    <q-menu${sizeAttr}>
      <button q-menu-button>Open Menu</button>
      <q-portal>
        <div q-menu-positioner>
          <div q-menu-content>
            <button q-menu-item value="item-1">
              <div icon="Component" q-menu-item-start-icon></div>
              <div q-menu-item-label>Menu option name</div>
              <div q-menu-item-command>
                <svg qIcon="ArrowBigUp" size="xs"></svg>
                <svg qIcon="Command" size="xs"></svg>Z
              </div>
            </button>
            <button q-menu-item value="item-2">
              <div icon="Component" q-menu-item-start-icon></div>
              <div q-menu-item-label>Menu option name</div>
            </button>
            <button q-menu-item value="item-3">
              <div icon="Component" q-menu-item-start-icon></div>
              <div q-menu-item-label>Menu option name</div>
            </button>
            <q-menu>
              <button q-menu-trigger-item value="item-4">
                <div icon="Component" q-menu-item-start-icon></div>
                <div q-menu-item-label>Menu option name</div>
              </button>
              <q-portal>
                <div q-menu-positioner>
                  <div q-menu-content>
                    <!-- Submenu content -->
                  </div>
                </div>
              </q-portal>
            </q-menu>
            <button q-menu-item value="item-5">
              <div icon="Component" q-menu-item-start-icon></div>
              <div q-menu-item-label>Menu option name</div>
            </button>
            <button defaultChecked q-menu-checkbox-item value="item-6">
              <div icon="Component" q-menu-item-start-icon></div>
              <div q-menu-item-label>Menu option name</div>
              <div q-menu-item-indicator></div>
            </button>
            ${checkboxSectionEl}
            ${radioSectionEl}
          </div>
        </div>
      </q-portal>
    </q-menu>`,
  id: "Menu",
  imports: [
    `import {MenuModule} from "@qualcomm-ui/angular/menu"`,
    `import {PortalComponent} from "@qualcomm-ui/angular-core/portal"`,
    `import {IconDirective} from "@qualcomm-ui/angular/icon"`,
    `import {ArrowBigUp, Command, Component} from "@lucide/angular"`,
  ],
  metadata: {nestable: true},
}
