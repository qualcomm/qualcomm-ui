// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=8157-32610
// component=_Dialog default

const figma = require("figma")

const instance = figma.selectedInstance

const dismiss = instance.getBoolean("dismiss")
const heading = instance.getBoolean("heading")
const icon = instance.getBoolean("icon")
const size = instance.getEnum("size", {md: "md"})
const slot = instance.getBoolean("slot")
const buttonGroup = instance.getBoolean("buttonGroup")
const destructive = instance.getBoolean("destructive")

const sizeAttr = size ? ` size="${size}"` : ""
const hideIndicatorIconAttr = !icon ? " hideIndicatorIcon" : ""

const headingText = instance.getString("headingText") || "Heading"
const headingEl = heading ? `<h2 q-dialog-heading>${headingText}</h2>` : ""
const dismissEl = dismiss ? `<button q-dialog-close-button></button>` : ""
const slotEl = slot ? `<!-- Custom content -->` : ""

const roleAttr = destructive ? ` role="alertdialog"` : ""
const confirmEmphasis = destructive ? "danger" : "primary"
const footerEl = buttonGroup
  ? `
    <div q-dialog-footer>
      <button emphasis="neutral" q-button q-dialog-close-trigger variant="outline">Cancel</button>
      <button emphasis="${confirmEmphasis}" q-button q-dialog-close-trigger>Confirm</button>
    </div>`
  : ""

export default {
  example: figma.code`
    <div defaultOpen q-dialog-root${roleAttr}${sizeAttr}>
      <q-dialog-floating-portal>
        <div${hideIndicatorIconAttr} q-dialog-body>
          ${dismissEl}
          ${headingEl}
          <p q-dialog-description>Lorem ipsum dolor sit amet.</p>
          ${slotEl}
        </div>
        ${footerEl}
      </q-dialog-floating-portal>
    </div>`,
  id: "DialogDefault",
  imports: [
    `import {DialogModule} from "@qualcomm-ui/angular/dialog"`,
    ...(buttonGroup
      ? [`import {ButtonModule} from "@qualcomm-ui/angular/button"`]
      : []),
  ],
  metadata: {nestable: true},
}
