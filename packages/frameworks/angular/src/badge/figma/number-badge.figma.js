// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=13390-5460
// component=Badge count

const figma = require("figma")

const instance = figma.selectedInstance

const emphasis = instance.getEnum("emphasis", {
  brand: "brand",
  "brand-outline": "brand-outline",
  danger: "danger",
  info: "info",
  "neutral-outline": "neutral-outline",
  "persistent-black": "persistent-black",
  "persistent-white": "persistent-white",
  success: "success",
  warning: "warning",
})
const size = instance.getEnum("size", {lg: "lg", sm: "sm"})
const disabled = instance.getEnum("disabled", {yes: true})
const label = instance.getString("label") || "5"

const emphasisAttr = emphasis ? ` emphasis="${emphasis}"` : ""
const sizeAttr = size ? ` size="${size}"` : ""
const disabledAttr = disabled ? " disabled" : ""

const example = figma.code`<span${disabledAttr}${emphasisAttr} q-number-badge${sizeAttr} [value]="${label}"></span>`

export default {
  example,
  id: "NumberBadge",
  imports: [`import {NumberBadgeDirective} from "@qualcomm-ui/angular/badge"`],
  metadata: {nestable: true},
}
