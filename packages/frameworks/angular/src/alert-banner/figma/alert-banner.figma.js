// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=3566-16209
// component=Alert banner

const figma = require("figma")

const instance = figma.selectedInstance

const emphasis = instance.getEnum("emphasis", {
  danger: "danger",
  neutral: "neutral",
  success: "success",
  warning: "warning",
})
const variant = instance.getEnum("variant", {subtle: "subtle"})
const showIcon = instance.getBoolean("showIcon")
const hasButton = instance.getBoolean("button")
const dismissable = instance.getBoolean("dismiss")
const hasDescription = instance.getBoolean("description")
const descriptionText = instance.getString("descriptionText") || "Description"
const heading = instance.getString("heading") || "Notification heading"

const emphasisAttr = emphasis ? ` emphasis="${emphasis}"` : ""
const variantAttr = variant ? ` variant="${variant}"` : ""

const buttonEmphasis = variant
  ? "neutral"
  : emphasis === "warning"
    ? "black-persistent"
    : "white-persistent"
const buttonEl = hasButton
  ? `
    <button
      emphasis="${buttonEmphasis}"
      q-alert-banner-action
      q-button
      size="sm"
      variant="outline"
    >
      Button
    </button>`
  : ""

let example
if (showIcon) {
  const descriptionAttr = hasDescription
    ? ` description="${descriptionText}"`
    : ""
  const dismissableAttr = dismissable ? " dismissable" : ""

  example = figma.code`
    <div${dismissableAttr}${emphasisAttr}
      heading="${heading}"
      q-alert-banner${variantAttr}${descriptionAttr}
    >
      ${buttonEl}
    </div>`
} else {
  const descriptionEl = hasDescription
    ? `<div q-alert-banner-description>${descriptionText}</div>`
    : ""
  const closeButtonEl = dismissable
    ? `<button q-alert-banner-close-button></button>`
    : ""
  const buttonActionEl = hasButton
    ? `
      <div q-alert-banner-action>
        ${buttonEl}
      </div>`
    : ""

  example = figma.code`
    <div${emphasisAttr} q-alert-banner-root${variantAttr}>
      <div q-alert-banner-heading>${heading}</div>
      ${descriptionEl}
      ${buttonActionEl}
      ${closeButtonEl}
    </div>`
}

export default {
  example,
  id: "AlertBanner",
  imports: [
    `import {AlertBannerModule} from "@qualcomm-ui/angular/alert-banner"`,
    ...(hasButton
      ? [`import {ButtonModule} from "@qualcomm-ui/angular/button"`]
      : []),
  ],
  metadata: {nestable: true},
}
