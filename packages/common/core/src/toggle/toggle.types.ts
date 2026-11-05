// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {
  BooleanAriaAttr,
  BooleanDataAttr,
} from "@qualcomm-ui/utils/attributes"
import type {Direction, DirectionProperty} from "@qualcomm-ui/utils/direction"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {ActionSchema, JSX, MachineSchema} from "@qualcomm-ui/utils/machine"

import type {toggleAnatomy} from "./toggle.anatomy.js"

export interface ToggleApiProps extends DirectionProperty {
  /**
   * The default pressed state of the toggle.
   */
  defaultPressed?: boolean | undefined

  /**
   * Whether the toggle is disabled.
   */
  disabled?: boolean | undefined

  /**
   * Event handler called when the pressed state of the toggle changes.
   */
  onPressedChange?: ((pressed: boolean) => void) | undefined

  /**
   * The pressed state of the toggle.
   */
  pressed?: boolean | undefined
}

export interface ToggleSchema extends MachineSchema {
  actions: ActionSchema<"setPressed" | "togglePressed">
  context: {
    pressed: boolean
  }
  events:
    | {type: "PRESS.TOGGLE"}
    | {type: "PRESS.SET"; value: boolean | undefined}
  props: RequiredBy<ToggleApiProps, "dir">
  state: "idle"
}

type PartName = AnatomyPartName<typeof toggleAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"toggle", P> {}

export interface ToggleIndicatorBindings extends Part<"indicator"> {
  "data-disabled": BooleanDataAttr
  "data-pressed": BooleanDataAttr
  "data-state": "on" | "off"
}

export interface ToggleRootBindings extends Part<"root"> {
  "aria-pressed": BooleanAriaAttr
  "data-disabled": BooleanDataAttr
  "data-pressed": BooleanDataAttr
  "data-state": "on" | "off"
  dir: Direction
  disabled: boolean | undefined
  onClick: JSX.MouseEventHandler
  type: "button"
}

export interface ToggleApi {
  /**
   * Whether the toggle is disabled.
   */
  disabled: boolean

  /**
   * Whether the toggle is pressed.
   */
  pressed: boolean

  /**
   * Sets the pressed state of the toggle.
   */
  setPressed: (pressed: boolean | undefined) => void

  // group: bindings
  getIndicatorBindings: () => ToggleIndicatorBindings
  getRootBindings: () => ToggleRootBindings
}
