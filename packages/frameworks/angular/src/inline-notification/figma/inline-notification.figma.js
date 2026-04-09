// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=3598-17285
// component=Inline notification

const figma = require("figma")

const instance = figma.selectedInstance

const emphasis = instance.getEnum("emphasis", {
  danger: "danger",
  neutral: "neutral",
  success: "success",
  warning: "warning",
})
const dismiss = instance.getEnum("dismiss", {true: true})

const inlineContent = instance.findInstance("_Inline content")
const heading = inlineContent?.getString("heading") || "Notification heading"
const hasDescription = inlineContent?.getBoolean("description")
const descriptionText =
  inlineContent?.getString("descriptionText") || "Description"
const showLink = inlineContent?.getBoolean("showLink")
const orientation = inlineContent?.getEnum("orientation", {
  vertical: "vertical",
})

const emphasisAttr = emphasis ? ` emphasis="${emphasis}"` : ""
const orientationAttr = orientation ? ` orientation="${orientation}"` : ""
const dismissableAttr = dismiss ? " dismissable" : ""
const descriptionAttr = hasDescription
  ? ` description="${descriptionText}"`
  : ""

const actionEl = showLink
  ? `<button q-inline-notification-action q-link>Action</button>`
  : ""

export default {
  example: figma.code`
    <div${descriptionAttr}${dismissableAttr}${emphasisAttr}
      label="${heading}"${orientationAttr}
      q-inline-notification
    >
      ${actionEl}
    </div>`,
  id: "InlineNotification",
  imports: [
    `import {InlineNotificationModule} from "@qualcomm-ui/angular/inline-notification"`,
    ...(showLink
      ? [`import {LinkDirective} from "@qualcomm-ui/angular/link"`]
      : []),
  ],
  metadata: {nestable: true},
}
