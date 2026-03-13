// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {DirectionProperty} from "@qualcomm-ui/utils/direction"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {
  ActionSchema,
  GuardSchema,
  JSX,
  MachineSchema,
} from "@qualcomm-ui/utils/machine"

export type TagVariant = "link" | "selectable" | "dismissable"

export interface TagApiProps extends DirectionProperty {
  /**
   * The default selected state of the tag. Only applicable when {@link variant} is
   * `selectable`.
   */
  defaultSelected?: boolean | undefined

  /**
   * Whether the tag is disabled.
   */
  disabled?: boolean | undefined

  /**
   * Callback fired when the dismiss button is clicked. Only applicable when
   * {@link variant} is `dismissable`.
   */
  onDismiss?: (() => void) | undefined

  /**
   * Event handler called when the selected state of the tag changes.
   */
  onSelectedChange?: ((pressed: boolean) => void) | undefined

  /**
   * The selected state of the tag. Only applicable when {@link variant} is
   * `selectable`.
   */
  selected?: boolean | undefined

  /**
   * Governs the interactive features of the tag.
   *
   * @default 'link'
   */
  variant?: TagVariant
}

export interface TagSchema extends MachineSchema {
  actions: ActionSchema<"setSelected" | "toggleSelected" | "dismiss">
  context: {
    selected: boolean
  }
  events:
    | {type: "SELECTED.TOGGLE"}
    | {type: "DISMISS"}
    | {type: "SELECTED.SET"; value: boolean | undefined}
  guards: GuardSchema<"isSelectable" | "isDismissable">
  props: RequiredBy<TagApiProps, "dir" | "variant">
  state: "idle" | "dismissed"
}

export interface TagCommonBindings extends Required<DirectionProperty> {
  "data-scope": "tag"
}

export interface TagDismissButtonBindings extends TagCommonBindings {
  "data-disabled": BooleanDataAttr
  "data-part": "dismiss-button"
  onClick: JSX.MouseEventHandler
}

export interface TagRootBindings extends TagCommonBindings {
  "data-disabled": BooleanDataAttr
  "data-dismissed": BooleanDataAttr
  "data-part": "root"
  "data-selected": BooleanDataAttr
  "data-variant": TagVariant
  disabled?: boolean | undefined
  onClick: JSX.MouseEventHandler
}

export interface TagApi {
  /**
   * Whether the tag is disabled.
   */
  disabled: boolean

  /**
   * Whether the tag is selected.
   */
  selected: boolean

  /**
   * Sets the pressed state of the toggle.
   */
  setSelected: (pressed: boolean | undefined) => void

  // group: bindings
  getDismissButtonBindings(): TagDismissButtonBindings
  getRootBindings(): TagRootBindings
}
