// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=13426-472
// component=Badge status

const figma = require("figma")

const instance = figma.selectedInstance

const variant = instance.getEnum("variant", {outline: "outlined"})
const emphasis = instance.getEnum("emphasis", {
  brand: "brand",
  danger: "danger",
  info: "info",
  success: "success",
  warning: "warning",
})
const size = instance.getEnum("size", {
  lg: "lg",
  sm: "sm",
  xl: "xl",
  xs: "xs",
})
const disabled = instance.getEnum("disabled", {yes: true})

const variantAttr = variant ? ` variant="${variant}"` : ""
const emphasisAttr = emphasis ? ` emphasis="${emphasis}"` : ""
const sizeAttr = size ? ` size="${size}"` : ""
const disabledAttr = disabled ? " disabled" : ""

const example = figma.code`<span${disabledAttr}${emphasisAttr} q-status-badge${sizeAttr}${variantAttr}></span>`

export default {
  example,
  id: "StatusBadge",
  imports: [`import {StatusBadgeDirective} from "@qualcomm-ui/angular/badge"`],
  metadata: {nestable: true},
}
