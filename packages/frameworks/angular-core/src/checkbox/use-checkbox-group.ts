// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, type Signal} from "@angular/core"

import {useControlledState} from "@qualcomm-ui/angular-core/state"

export interface UseCheckboxGroupProps {
  /**
   * The initial value of `value` when uncontrolled
   */
  defaultValue?: Signal<string[] | undefined> | string[] | undefined

  /**
   * If `true`, the checkbox group is disabled
   */
  disabled?: boolean | undefined

  /**
   * The callback to call when the value changes
   */
  onValueChange?: ((value: string[]) => void) | undefined

  /**
   * If `true`, the checkbox group is read-only
   */
  readOnly?: boolean | undefined

  /**
   * The controlled value of the checkbox group
   */
  value?: Signal<string[] | undefined>
}

export interface CheckboxGroupState {
  isChecked: (val: string | undefined) => boolean
  removeValue: (val: string) => void
  setValue: (value: string[]) => void
  toggleValue: (val: string) => void
  value: Signal<string[]>
}

export function useCheckboxGroup(
  props: UseCheckboxGroupProps = {},
): CheckboxGroupState {
  const {
    defaultValue,
    disabled,
    onValueChange,
    readOnly,
    value: controlledValue,
  } = props

  const state = useControlledState({
    defaultValue: computed(() => access(defaultValue) || []),
    onChange: (value) => onValueChange?.(value || []),
    value: controlledValue,
  })

  const {setValue, value: getValue} = state()

  const value = computed(() => getValue() || [])

  const interactive = !disabled && !readOnly

  const getIsChecked = (val: string | undefined) => {
    return computed(() => value().some((v) => String(v) === String(val)))
  }

  const isChecked = (val: string | undefined) => getIsChecked(val)()

  const toggleValue = (val: string) => {
    if (!interactive) {
      return
    }
    if (isChecked(val)) {
      removeValue(val)
    } else {
      addValue(val)
    }
  }

  const addValue = (val: string) => {
    if (!interactive) {
      return
    }
    if (isChecked(val)) {
      return
    }
    setValue(value().concat(val))
  }

  const removeValue = (val: string) => {
    if (!interactive) {
      return
    }
    setValue(value().filter((v) => String(v) !== String(val)))
  }

  return {
    isChecked,
    removeValue,
    setValue,
    toggleValue,
    value,
  }
}

function access<T>(value: Signal<T> | T | undefined): T | undefined {
  if (value === undefined) {
    return undefined
  }
  if (typeof value === "function") {
    return (value as unknown as Signal<T>)()
  }
  return value as T
}
