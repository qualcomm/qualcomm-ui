// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=2161-18192
// component=AccordionItem

const figma = require("figma")

const instance = figma.selectedInstance

const leftChevron = instance.getEnum("chevron", {left: "left"})
const disabled = instance.getEnum("state", {disabled: true})
const header = instance.getString("headerText") || "Title of accordion"
const icon = instance.getBoolean("icon")
const subHeader = instance.getBoolean("subHeader")
const subHeaderText = instance.getString("subHeaderText")

const needsIcon = icon && !leftChevron
const swapPropName = {lg: "iconSm", md: "iconXs", sm: "iconXxs"}[
  instance.getString("size")
]
const iconInstance = needsIcon
  ? instance.getInstanceSwap(swapPropName)
  : undefined
const iconName = iconInstance ? toLucideName(iconInstance.name) : "AArrowDown"

const disabledAttr = disabled ? " disabled" : ""
const iconAttr = icon ? ` icon="${iconName}"` : ""
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
    <div${disabledAttr} q-accordion-item-root value="">
      <button q-accordion-item-trigger>
        <q-accordion-item-indicator />
        <span q-accordion-item-text>${header}</span>
        ${secondaryTextEl}
      </button>
      <div q-accordion-item-content>Panel contents</div>
    </div>`
} else {
  example = figma.code`
    <div${disabledAttr}${iconAttr} q-accordion-item${secondaryTextAttr}${textAttr} value="">
      Panel contents
    </div>`
}

export default {
  example,
  id: "AccordionItem",
  imports: [
    `import {AccordionModule} from "@qualcomm-ui/angular/accordion"`,
    ...(needsIcon
      ? [
          `import {IconDirective} from "@qualcomm-ui/angular/icon"`,
          `import {Lucide${iconName}} from "@lucide/angular"`,
        ]
      : []),
  ],
  metadata: {nestable: true},
}

function toLucideName(figmaName) {
  return figmaName
    .replace(/^utl\//, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}
