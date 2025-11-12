// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {trackFocusVisible} from "@qualcomm-ui/dom/focus-visible"
import {
  dispatchInputCheckedEvent,
  setElementChecked,
  trackFormControl,
  trackPress,
} from "@qualcomm-ui/dom/query"
import {
  createGuards,
  createMachine,
  type MachineConfig,
} from "@qualcomm-ui/utils/machine"

import type {CheckboxSchema} from "./checkbox.types"
import {domEls} from "./internal"

const {not} = createGuards<CheckboxSchema>()

export const checkboxMachine: MachineConfig<CheckboxSchema> =
  createMachine<CheckboxSchema>({
    actions: {
      dispatchChangeEvent({context, scope}) {
        queueMicrotask(() => {
          const inputEl = domEls.hiddenInput(scope)
          if (inputEl) {
            dispatchInputCheckedEvent(inputEl, {
              checked: context.get("checked"),
            })
          }
        })
      },
      removeFocusIfNeeded({context, prop}) {
        if (prop("disabled") && context.get("focused")) {
          context.set("focused", false)
          context.set("focusVisible", false)
        }
      },
      setChecked({context, event}) {
        if (event.type === "CHECKED.SET") {
          context.set("checked", !!event.checked)
        }
      },
      setContext({context, event}) {
        if (event.type !== "CONTEXT.SET") {
          return
        }
        for (const [key, value] of Object.entries(event.context)) {
          context.set(key as keyof CheckboxSchema["context"], value)
        }
      },
      syncInputElement({computed, context, scope}) {
        const inputEl = domEls.hiddenInput(scope)
        if (!inputEl) {
          return
        }
        setElementChecked(inputEl, context.get("checked"))
        inputEl.indeterminate = !!computed("indeterminate")
      },
      toggleChecked({computed, context}) {
        const checked = computed("indeterminate")
          ? true
          : !context.get("checked")
        context.set("checked", checked)
      },
    },
    computed: {
      disabled: ({context, prop}) =>
        prop("disabled") || context.get("fieldsetDisabled"),
      indeterminate: ({context, prop}) =>
        prop("indeterminate") && !context.get("checked"),
    },
    context: ({bindable, prop}) => {
      return {
        active: bindable<boolean>(() => ({defaultValue: false})),
        checked: bindable<boolean>(() => ({
          defaultValue: prop("defaultChecked"),
          onChange: prop("onCheckedChange"),
          value: prop("checked"),
        })),
        fieldsetDisabled: bindable<boolean>(() => ({defaultValue: false})),
        focused: bindable<boolean>(() => ({
          defaultValue: false,
          onChange: prop("onFocusChange"),
        })),
        focusVisible: bindable<boolean>(() => ({defaultValue: false})),
        hovered: bindable<boolean>(() => ({defaultValue: false})),
      }
    },

    effects: {
      trackFocusVisible({computed, scope}) {
        if (computed("disabled")) {
          return
        }
        return trackFocusVisible({root: scope.getRootNode?.()})
      },

      trackFormControlState({context, scope}) {
        return trackFormControl(domEls.hiddenInput(scope), {
          onFieldsetDisabledChange(disabled) {
            context.set("fieldsetDisabled", disabled)
          },
          onFormReset() {
            context.set("checked", !!context.initial("checked"))
          },
        })
      },

      trackPressEvent({computed, context, scope}) {
        if (computed("disabled")) {
          return
        }
        return trackPress({
          isValidKey: (event) => event.key === " ",
          keyboardNode: domEls.hiddenInput(scope),
          onPress: () => context.set("active", false),
          onPressEnd: () => context.set("active", false),
          onPressStart: () => context.set("active", true),
          pointerNode: domEls.root(scope),
        })
      },
    },

    guards: {
      isTrusted: ({event}) => ("isTrusted" in event ? event.isTrusted : false),
    },

    ids: ({bindableId, ids}) => {
      return {
        control: bindableId<string>(),
        errorText: bindableId<string>(ids?.errorText),
        hiddenInput: bindableId<string>(ids?.hiddenInput),
        label: bindableId<string>(ids?.label),
        root: bindableId<string>(ids?.root),
      }
    },

    initialState: () => "idle",

    on: {
      "CHECKED.SET": [
        {
          actions: ["setChecked", "dispatchChangeEvent"],
          guard: not("isTrusted"),
        },
        {
          actions: ["setChecked"],
        },
      ],
      "CHECKED.TOGGLE": [
        {
          actions: ["toggleChecked", "dispatchChangeEvent"],
          guard: not("isTrusted"),
        },
        {
          actions: ["toggleChecked"],
        },
      ],
      "CONTEXT.SET": {
        actions: ["setContext"],
      },
    },

    onInit: {
      effects: [
        "trackFormControlState",
        "trackPressEvent",
        "trackFocusVisible",
      ],
    },

    props({props}) {
      return {dir: "ltr", value: "on", ...props}
    },

    states: {
      idle: {},
    },

    watch({actions, context, prop, track}) {
      track([() => prop("disabled")], () => {
        actions.removeFocusIfNeeded()
      })
      track([() => context.get("checked")], () => {
        actions.syncInputElement()
      })
    },
  })
