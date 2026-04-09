// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=3485-375
// component=Toast

const figma = require("figma")

const instance = figma.selectedInstance

const emphasis = instance.getString("emphasis")
const heading = instance.getString("heading")
const hasDescription = instance.getBoolean("description")
const descriptionText = instance.getString("descriptionText")
const hasButton = instance.getBoolean("button")
const closable = instance.getBoolean("dismiss")

const typeProperty = emphasis ? `type: "${emphasis}",` : ""
const closableProperty = closable ? "" : "closable: false,"
const descriptionProperty = hasDescription
  ? `description: "${descriptionText}",`
  : ""
const actionProperty = hasButton
  ? 'action: {label: "Button", onClick: () => {}},'
  : ""

export default {
  example: figma.code`
import {Component, inject} from "@angular/core"
import {provideToaster, ToasterService, ToastModule} from "@qualcomm-ui/angular/toast"

@Component({
  imports: [ToastModule],
  providers: [provideToaster({placement: "bottom-end"})],
  template: \`<div q-toaster [toaster]="toaster"></div>\`,
})
export class Example {
  toaster = inject(ToasterService).toaster

  createToast() {
    this.toaster.create({
      ${actionProperty}${closableProperty}${descriptionProperty}
      label: "${heading}",
      ${typeProperty}
    })
  }
}`,
  id: "Toast",
  imports: [],
}
