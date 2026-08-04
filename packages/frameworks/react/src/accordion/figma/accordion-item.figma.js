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
const iconAttr = icon ? ` icon={${iconName}}` : ""
const secondaryTextAttr =
  subHeader && subHeaderText ? ` secondaryText="${subHeaderText}"` : ""

let example
if (leftChevron) {
  const secondaryTextEl =
    subHeader && subHeaderText
      ? `\n          <Accordion.ItemSecondaryText>${subHeaderText}</Accordion.ItemSecondaryText>`
      : ""
  example = figma.code`
    <Accordion.ItemRoot${disabledAttr} value="">
      <Accordion.ItemTrigger>
        <Accordion.ItemIndicator />
        <Accordion.ItemText>${header}</Accordion.ItemText>${secondaryTextEl}
      </Accordion.ItemTrigger>
      <Accordion.ItemContent>Panel contents</Accordion.ItemContent>
    </Accordion.ItemRoot>`
} else {
  example = figma.code`<Accordion.Item${disabledAttr}${iconAttr}${secondaryTextAttr} text="${header}" value="">Panel contents</Accordion.Item>`
}

export default {
  example,
  id: "AccordionItem",
  imports: [
    `import {Accordion} from "@qualcomm-ui/react/accordion"`,
    ...(needsIcon ? [`import {${iconName}} from "lucide-react"`] : []),
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
