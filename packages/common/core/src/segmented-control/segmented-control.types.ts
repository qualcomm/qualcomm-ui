// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {BooleanDataAttr, IdParam} from "@qualcomm-ui/utils/attributes"
import type {Direction, DirectionProperty} from "@qualcomm-ui/utils/direction"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {
  ActionSchema,
  EffectSchema,
  IdRegistrationProps,
  JSX,
  MachineSchema,
} from "@qualcomm-ui/utils/machine"

export type SegmentedControlOrientation = "horizontal" | "vertical"

export interface SegmentedControlApiProps extends DirectionProperty {
  /**
   * The initial value of the group when rendered.
   * Use when you don't need to control the value of the group.
   */
  defaultValue?: string[] | null | undefined

  /**
   * Whether the group is disabled. When true, prevents user interaction and
   * applies visual styling to indicate the disabled state.
   */
  disabled?: boolean | undefined

  /**
   * The id of the form that the input belongs to.
   */
  form?: string | undefined

  /**
   * Whether the control allows multiple selections or not.
   */
  multiple?: boolean

  /**
   * The name of the input field(s).
   *
   * @default the control's id
   */
  name?: string | undefined

  /**
   * Function called when the value of the segmented control group changes.
   */
  onValueChange?: ((value: string[] | null | undefined) => void) | undefined

  /**
   * Orientation of the segmented control group.
   *
   * @default 'horizontal'
   */
  orientation?: SegmentedControlOrientation | undefined

  /**
   * The controlled value of the group.
   */
  value?: string[] | null | undefined
}

export interface SegmentedControlItemApiProps {
  /**
   * Whether the item is disabled.
   */
  disabled?: boolean

  /**
   * The value of the item.
   */
  value: string
}

type PropsWithDefault = keyof Pick<
  SegmentedControlApiProps,
  "dir" | "orientation"
>

export interface SegmentedControlSchema extends MachineSchema {
  actions: ActionSchema<"selectItem" | "switchSelectionMode" | "contextSet">
  computed: {
    disabled: boolean
  }
  context: {
    fieldsetDisabled: boolean
    value: string[] | null | undefined
  }
  effects: EffectSchema<"trackFormControlState">
  events:
    | {
        sourceId: string
        type: "SELECT"
      }
    | {
        checked: boolean
        itemValue: string
        type: "CONTEXT.SET"
      }
  ids: {
    root: string
  }
  props: RequiredBy<SegmentedControlApiProps, PropsWithDefault>
  state: "idle"
}

export interface SegmentedControlGroupBindings extends DirectionProperty {
  "aria-orientation": SegmentedControlOrientation
  "data-disabled": BooleanDataAttr
  "data-orientation": SegmentedControlOrientation
  "data-part": "group"
  "data-scope": "segmented-control"
  id: string
}

export interface SegmentedControlItemBindings {
  onKeyDown: JSX.KeyboardEventHandler<HTMLLabelElement>
}

export interface SegmentedControlApi {
  defaultValue: string[] | null | undefined
  dir: Direction
  disabled: boolean | undefined
  getGroupBindings: (
    params: IdRegistrationProps,
  ) => SegmentedControlGroupBindings
  getItemBindings: (id: IdParam) => SegmentedControlItemBindings
  getName: () => string
  handleChange: (itemValue: string, checked: boolean) => void
  value: string[] | null | undefined
}
