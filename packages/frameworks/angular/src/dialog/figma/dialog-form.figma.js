// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=17824-6387
// component=_Dialog form

const figma = require("figma")

const instance = figma.selectedInstance

const dismiss = instance.getBoolean("dismiss")
const heading = instance.getBoolean("heading")
const icon = instance.getBoolean("icon")
const size = instance.getEnum("size", {md: "md"})
const buttonGroup = instance.getBoolean("buttonGroup")

const sizeAttr = size ? ` size="${size}"` : ""
const hideIndicatorIconAttr = !icon ? " hideIndicatorIcon" : ""

const headingText = instance.getString("headingText") || "Heading"
const headingEl = heading ? `<h2 q-dialog-heading>${headingText}</h2>` : ""
const dismissEl = dismiss ? `<button q-dialog-close-button></button>` : ""

const footerEl = buttonGroup
  ? `
    <div q-dialog-footer>
      <button emphasis="neutral" q-button q-dialog-close-trigger variant="outline">Cancel</button>
      <button emphasis="primary" q-button q-dialog-close-trigger>Confirm</button>
    </div>`
  : ""

export default {
  example: figma.code`
    <div defaultOpen q-dialog-root${sizeAttr}>
      <q-dialog-floating-portal>
        <div${hideIndicatorIconAttr} q-dialog-body>
          ${dismissEl}
          ${headingEl}
          <p q-dialog-description>Lorem ipsum dolor sit amet.</p>
          <!-- Form content -->
        </div>
        ${footerEl}
      </q-dialog-floating-portal>
    </div>`,
  id: "DialogForm",
  imports: [
    `import {DialogModule} from "@qualcomm-ui/angular/dialog"`,
    ...(buttonGroup
      ? [`import {ButtonModule} from "@qualcomm-ui/angular/button"`]
      : []),
  ],
  metadata: {nestable: true},
}
