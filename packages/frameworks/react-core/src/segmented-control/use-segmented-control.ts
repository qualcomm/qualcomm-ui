// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createSegmentedControlApi,
  type SegmentedControlApi,
  type SegmentedControlApiProps,
  type SegmentedControlItemApiProps,
  segmentedControlMachine,
} from "@qualcomm-ui/core/segmented-control"
import {useCheckbox} from "@qualcomm-ui/react-core/checkbox"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"

import {useSegmentedControlContext} from "./segmented-control-context"

export function useSegmentedControl(
  props: SegmentedControlApiProps,
): SegmentedControlApi {
  const machine = useMachine(segmentedControlMachine, props)
  return createSegmentedControlApi(machine, normalizeProps)
}

export function useSegmentedControlItem({
  disabled,
  value,
}: SegmentedControlItemApiProps) {
  const {
    defaultValue: groupDefaultValue,
    dir,
    disabled: groupDisabled,
    getItemBindings,
    getName,
    handleChange,
    value: groupValue,
  } = useSegmentedControlContext()

  const checkboxContext = useCheckbox({
    checked: groupValue?.includes(value),
    defaultChecked: groupDefaultValue?.includes(value),
    dir,
    disabled: groupDisabled || disabled,
    name: getName(),
    onCheckedChange: (next: boolean) => {
      handleChange(value, next)
    },
    value,
  })

  return {
    checkboxContext,
    getItemBindings,
  }
}
