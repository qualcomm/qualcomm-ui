// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {fieldsetAnatomy} from "./fieldset.anatomy.js"

export interface FieldsetApiProps {
  /**
   * Indicates whether the fieldset is disabled.
   */
  disabled?: boolean

  /**
   * Indicates whether the fieldset is invalid.
   */
  invalid?: boolean
}

export interface FieldsetElementIds {
  errorText: string | undefined
  hint: string | undefined
}

type PartName = AnatomyPartName<typeof fieldsetAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"fieldset", P> {}

export interface FieldsetRootBindings extends Part<"root"> {
  "aria-describedby": string | undefined
  "data-disabled": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  disabled: boolean | undefined
}

export interface FieldsetLegendBindings extends Part<"legend"> {
  "data-disabled": BooleanDataAttr
  "data-invalid": BooleanDataAttr
}

export interface FieldsetHintBindings extends Part<"hint"> {
  "data-disabled": BooleanDataAttr
  id: string
}

export interface FieldsetErrorTextBindings extends Part<"errorText"> {
  "aria-live": "polite"
  "data-disabled": BooleanDataAttr
}

export interface FieldsetApi {
  disabled: boolean
  getErrorTextBindings(): FieldsetErrorTextBindings
  getHintBindings(): FieldsetHintBindings
  getLegendBindings(): FieldsetLegendBindings
  getRootBindings(): FieldsetRootBindings
  invalid: boolean
}
