// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=14305-13751
// component=Badge text

const figma = require("figma")

const instance = figma.selectedInstance

const variant = instance.getEnum("variant", {subtle: "subtle"})
const emphasis = instance.getEnum("emphasis", {
  blue: "blue",
  brand: "brand",
  cyan: "cyan",
  danger: "danger",
  green: "green",
  info: "info",
  lime: "lime",
  magenta: "magenta",
  orange: "orange",
  purple: "purple",
  red: "red",
  success: "success",
  teal: "teal",
  warning: "warning",
  yellow: "yellow",
})
const size = instance.getEnum("size", {lg: "lg", sm: "sm"})
const disabled = instance.getEnum("disabled", {yes: true})
const label = instance.getString("label") || "badge"

const variantAttr = variant ? ` variant="${variant}"` : ""
const emphasisAttr = emphasis ? ` emphasis="${emphasis}"` : ""
const sizeAttr = size ? ` size="${size}"` : ""
const disabledAttr = disabled ? " disabled" : ""

const example = figma.code`<span${disabledAttr}${emphasisAttr} q-badge${sizeAttr}${variantAttr}>${label}</span>`

export default {
  example,
  id: "TextBadge",
  imports: [`import {BadgeDirective} from "@qualcomm-ui/angular/badge"`],
  metadata: {nestable: true},
}
