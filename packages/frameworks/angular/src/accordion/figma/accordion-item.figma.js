// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=2161-18192
// component=Accordion

const figma = require("figma")

const instance = figma.selectedInstance

const leftChevron = instance.getEnum("chevron", {left: "left"})
const disabled = instance.getEnum("state", {disabled: true})
const header = instance.getString("headerText") || "Title of accordion"
const icon = instance.getBoolean("icon")
const subHeader = instance.getBoolean("subHeader")
const subHeaderText = instance.getString("subHeaderText")

const disabledAttr = disabled ? " disabled" : ""
const iconAttr = icon ? ` icon="FileChartColumn"` : ""
const secondaryTextAttr =
  subHeader && subHeaderText ? ` secondaryText="${subHeaderText}"` : ""
const textAttr = ` text="${header}"`

let example
if (leftChevron) {
  const secondaryTextEl =
    subHeader && subHeaderText
      ? `<span q-accordion-item-secondary-text>${subHeaderText}</span>`
      : ""
  example = figma.code`
    <div${disabledAttr} q-accordion-item-root value="a">
      <button q-accordion-item-trigger>
        <q-accordion-item-indicator />
        <span q-accordion-item-text>${header}</span>
        ${secondaryTextEl}
      </button>
      <div q-accordion-item-content>Panel contents</div>
    </div>`
} else {
  example = figma.code`
    <div${disabledAttr}${iconAttr} q-accordion-item${secondaryTextAttr}${textAttr} value="a">
      Panel contents
    </div>`
}

export default {
  example,
  id: "AccordionItem",
  imports: [
    `import {AccordionModule} from "@qualcomm-ui/angular/accordion"`,
    ...(icon && !leftChevron
      ? [
          `import {IconDirective} from "@qualcomm-ui/angular/icon"`,
          `import {FileChartColumn} from "lucide-angular"`,
        ]
      : []),
  ],
  metadata: {nestable: true},
}
