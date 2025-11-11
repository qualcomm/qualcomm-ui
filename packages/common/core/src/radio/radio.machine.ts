// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {trackFocusVisible} from "@qualcomm-ui/dom/focus-visible"
import {
  dispatchInputCheckedEvent,
  trackFormControl,
} from "@qualcomm-ui/dom/query"
import {
  createGuards,
  createMachine,
  type MachineConfig,
} from "@qualcomm-ui/utils/machine"

import {
  domEls,
  getFirstEnabledAndCheckedInputEl,
  getFirstEnabledInputEl,
  getInputEls,
} from "./internal"
import type {RadioSchema} from "./radio.types"

const {not} = createGuards<RadioSchema>()

export const radioMachine: MachineConfig<RadioSchema> =
  createMachine<RadioSchema>({
    actions: {
      dispatchChangeEvent({context, scope}) {
        const inputEls = getInputEls(scope)
        inputEls.forEach((inputEl) => {
          const checked = inputEl.value === context.get("value")
          if (checked === inputEl.checked) {
            return
          }
          dispatchInputCheckedEvent(inputEl, {checked})
        })
      },
      focusInput({scope}) {
        const nodeToFocus =
          getFirstEnabledAndCheckedInputEl(scope) ??
          getFirstEnabledInputEl(scope)
        nodeToFocus?.focus()
      },
      setActive({context, event}) {
        context.set("activeValue", event.value)
      },
      setFocused({context, event}) {
        context.set("focusedValue", event.value)
      },
      setHovered({context, event}) {
        context.set("hoveredValue", event.value)
      },
      setValue({context, event}) {
        context.set("value", event.value)
      },
      syncInputElements({context, scope}) {
        const inputs = getInputEls(scope)
        inputs.forEach((input) => {
          input.checked = input.value === context.get("value")
        })
      },
    },
    computed: {
      disabled: ({context, prop}) =>
        !!prop("disabled") || context.get("fieldsetDisabled"),
    },
    context({bindable, prop}) {
      return {
        activeValue: bindable<string | null>(() => ({
          defaultValue: null,
        })),
        fieldsetDisabled: bindable<boolean>(() => ({
          defaultValue: false,
        })),
        focusedValue: bindable<string | null>(() => ({
          defaultValue: null,
        })),
        hoveredValue: bindable<string | null>(() => ({
          defaultValue: null,
        })),
        value: bindable<string | null>(() => ({
          defaultValue: prop("defaultValue"),
          onChange(value) {
            prop("onValueChange")?.(value)
          },
          value: prop("value"),
        })),
      }
    },
    effects: {
      trackFocusVisible({scope}) {
        return trackFocusVisible({root: scope.getRootNode?.()})
      },
      trackFormControlState({context, scope}) {
        return trackFormControl(domEls.root(scope), {
          onFieldsetDisabledChange(disabled) {
            context.set("fieldsetDisabled", disabled)
          },
          onFormReset() {
            context.set("value", context.initial("value")!)
          },
        })
      },
    },
    guards: {
      isTrusted: ({event}) => !!event.isTrusted,
    },
    ids({bindableId, bindableIdCollection}) {
      return {
        errorText: bindableId(),
        item: bindableIdCollection(),
        itemHiddenInput: bindableIdCollection(),
        itemLabel: bindableIdCollection(),
        label: bindableId(),
        root: bindableId(),
      }
    },
    initialEffects: ["trackFormControlState", "trackFocusVisible"],
    initialState: () => "idle",
    on: {
      FOCUS_INPUT: {
        actions: ["focusInput"],
      },
      SET_ACTIVE: {
        actions: ["setActive"],
      },
      SET_FOCUSED: {
        actions: ["setFocused"],
      },
      SET_HOVERED: {
        actions: ["setHovered"],
      },
      SET_VALUE: [
        {
          actions: ["setValue", "dispatchChangeEvent"],
          guard: not("isTrusted"),
        },
        {
          actions: ["setValue"],
        },
      ],
    },
    props({props}) {
      return {dir: "ltr", orientation: "vertical", ...props}
    },
    states: {
      idle: {},
    },
  })
