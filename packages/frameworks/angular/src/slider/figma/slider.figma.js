// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=6427-386
// component=Slider

const figma = require("figma")

const instance = figma.selectedInstance

const label = instance.getBoolean("label", {
  true: instance.getString("labelText"),
})
const hint = instance.getBoolean("hint", {
  true: instance.getString("hintText"),
})
const disabled = instance.getEnum("state", {
  disabled: true,
})
const invalid = instance.getEnum("state", {
  invalid: true,
})
const errorText = invalid ? instance.getString("errorText") : undefined
const sideMarkers = instance.getEnum("valuePosition", {
  side: true,
})
const size = instance.getEnum("size", {
  sm: "sm",
})
const variant = instance.getEnum("emphasis", {
  neutral: "neutral",
})
const isRange = instance.getEnum("variant", {
  range: true,
})

const rangeText = instance.getString("rangeText")
const [rangeMin, rangeMax] = rangeText.split(" - ").map(Number)
const valueText = instance.getString("valueText")
const value = parseInt(valueText, 10)

const defaultValue = isRange ? `[${rangeMin}, ${rangeMax}]` : `[${value}]`

const defaultValueAttr = ` [defaultValue]="${defaultValue}"`
const disabledAttr = disabled ? " disabled" : ""
const errorTextAttr = errorText ? ` errorText="${errorText}"` : ""
const hintAttr = hint ? ` hint="${hint}"` : ""
const invalidAttr = invalid ? " invalid" : ""
const labelAttr = label ? ` label="${label}"` : ""
const sideMarkersAttr = sideMarkers ? " sideMarkers" : ""
const sizeAttr = size ? ` size="${size}"` : ""
const variantAttr = variant ? ` variant="${variant}"` : ""

export default {
  example: figma.code`
    <q-slider${defaultValueAttr}${disabledAttr}${errorTextAttr}${hintAttr}${invalidAttr}${labelAttr}${sideMarkersAttr}${sizeAttr}${variantAttr}>
    </q-slider>`,
  id: "Slider",
  imports: [`import {SliderModule} from "@qualcomm-ui/angular/slider"`],
  metadata: {nestable: true},
}
