// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=10872-1658
// component=Drawer

const figma = require("figma")

const instance = figma.selectedInstance

const dismiss = instance.getBoolean("dismiss")
const description = instance.getBoolean("description")
const heading = instance.getBoolean("heading")
const icon = instance.getBoolean("icon")
const size = instance.getEnum("size", {md: "md"})
const slot = instance.getBoolean("slot")
const variant = instance.getEnum("variant", {form: "form"})
const buttonGroup = instance.getBoolean("buttonGroup")

const sizeAttr = size ? ` size="${size}"` : ""
const hideIndicatorIconAttr = !icon ? " hideIndicatorIcon" : ""

const headingText = instance.getString("headingText") || "Heading"
const headingEl = heading ? `<h2 q-drawer-heading>${headingText}</h2>` : ""
const dismissEl = dismiss ? `<button q-drawer-close-button></button>` : ""

const descriptionText =
  instance.getString("descriptionText") || "Lorem ipsum dolor sit amet."
const descriptionEl = description
  ? `<p q-drawer-description>${descriptionText}</p>`
  : ""

const contentEl =
  variant === "form"
    ? `<!-- Form content -->`
    : slot
      ? `<!-- Custom content -->`
      : ""

const footerEl = buttonGroup
  ? `
    <div q-drawer-footer>
      <button emphasis="neutral" q-button q-drawer-close-trigger variant="outline">Cancel</button>
      <button emphasis="primary" q-button q-drawer-close-trigger>Confirm</button>
    </div>`
  : ""

export default {
  example: figma.code`
    <div defaultOpen q-drawer-root${sizeAttr}>
      <q-drawer-floating-portal>
        <div${hideIndicatorIconAttr} q-drawer-body>
          ${dismissEl}
          ${headingEl}
          ${descriptionEl}
          ${contentEl}
        </div>
        ${footerEl}
      </q-drawer-floating-portal>
    </div>`,
  id: "Drawer",
  imports: [
    `import {DrawerModule} from "@qualcomm-ui/angular/drawer"`,
    ...(buttonGroup
      ? [`import {ButtonModule} from "@qualcomm-ui/angular/button"`]
      : []),
  ],
  metadata: {nestable: true},
}
