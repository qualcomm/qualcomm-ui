// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {fieldGroupAnatomy} from "./field-group.anatomy.js"
import type {fieldGroupClasses} from "./field-group.classes.js"

export type QdsFieldGroupSize = "sm" | "md" | "lg"

export type QdsFieldGroupOrientation = "vertical" | "horizontal"

export interface QdsFieldGroupApiProps {
  /**
   * Adds padding at the start of the items container.
   */
  indented?: boolean

  /**
   * Marks the group as invalid.
   */
  invalid?: boolean

  /**
   * Layout direction for items.
   * @default 'vertical'
   */
  orientation?: QdsFieldGroupOrientation

  /**
   * The size of the group items.
   * @default 'md'
   */
  size?: QdsFieldGroupSize
}

type FieldGroupClasses = typeof fieldGroupClasses

type PartName = AnatomyPartName<typeof fieldGroupAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"fieldGroup", P> {}

export interface QdsFieldGroupRootBindings extends Part<"root"> {
  className: FieldGroupClasses["root"]
  "data-invalid": BooleanDataAttr
}

export interface QdsFieldGroupLabelBindings extends Part<"label"> {
  className: FieldGroupClasses["label"]
}

export interface QdsFieldGroupItemsBindings extends Part<"items"> {
  className: FieldGroupClasses["items"]
  "data-indented": BooleanDataAttr
  "data-orientation": QdsFieldGroupOrientation
  "data-size": QdsFieldGroupSize
}

export interface QdsFieldGroupHintBindings extends Part<"hint"> {
  className: FieldGroupClasses["hint"]
}

export interface QdsFieldGroupErrorTextBindings extends Part<"errorText"> {
  className: FieldGroupClasses["errorText"]
}

export interface QdsFieldGroupApi {
  getErrorTextBindings(): QdsFieldGroupErrorTextBindings
  getHintBindings(): QdsFieldGroupHintBindings
  getItemsBindings(): QdsFieldGroupItemsBindings
  getLabelBindings(): QdsFieldGroupLabelBindings
  getRootBindings(): QdsFieldGroupRootBindings

  indented: boolean
  invalid: boolean
  orientation: QdsFieldGroupOrientation
  size: QdsFieldGroupSize
}
