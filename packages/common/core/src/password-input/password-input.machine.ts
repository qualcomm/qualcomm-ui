// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {trackFormControl} from "@qualcomm-ui/dom/query"
import {createMachine, type MachineConfig} from "@qualcomm-ui/utils/machine"

import {domEls} from "./internal"
import type {PasswordInputSchema} from "./password-input.types"

export const passwordInputMachine: MachineConfig<PasswordInputSchema> =
  createMachine({
    actions: {
      focusInputEl({computed, scope}) {
        if (!computed("disabled")) {
          domEls.input(scope)?.focus()
        }
      },
      setFocused({context, event}) {
        if (event.type !== "FOCUSED.SET") {
          return
        }
        context.set("focused", event.focused)
        context.set("focusVisible", event.focusVisible)
      },
      setValue: ({context, event}) => {
        if (event.type === "VALUE.SET") {
          context.set("value", event.value)
        }
      },
      setVisibility({context, event}) {
        if (event.type !== "VISIBILITY.SET") {
          return
        }
        context.set("visible", event.visible)
      },
      toggleVisibility({context}) {
        context.set("visible", (prev) => !prev)
      },
    },
    computed: {
      disabled: ({context, prop}) =>
        prop("disabled") || context.get("fieldsetDisabled"),
    },
    context: ({bindable, prop}) => {
      return {
        fieldsetDisabled: bindable<boolean>(() => ({defaultValue: false})),
        focused: bindable<boolean>(() => ({
          defaultValue: false,
          onChange: prop("onFocusChange"),
        })),
        focusVisible: bindable<boolean>(() => ({defaultValue: false})),
        ssr: bindable<boolean>(() => ({defaultValue: true})),
        value: bindable<string>(() => ({
          defaultValue: prop("defaultValue"),
          onChange: prop("onValueChange"),
          value: prop("value"),
        })),
        visible: bindable<boolean>(() => ({
          defaultValue: prop("defaultVisible"),
          onChange: prop("onVisibleChange"),
          value: prop("visible"),
        })),
      }
    },
    effects: {
      syncSsr({context}) {
        context.set("ssr", false)
      },
      trackFormControlState({context, scope}) {
        return trackFormControl(domEls.input(scope), {
          onFieldsetDisabledChange: (disabled) => {
            context.set("fieldsetDisabled", disabled)
          },
          onFormReset: () => {
            context.set("value", context.initial("value") || "")
          },
        })
      },
    },
    ids: ({bindableId, ids}) => {
      return {
        errorText: bindableId<string>(ids?.errorText),
        hint: bindableId<string>(ids?.hint),
        input: bindableId<string>(ids?.input),
        label: bindableId<string>(ids?.label),
        visibilityTrigger: bindableId<string>(ids?.visibilityTrigger),
      }
    },
    initialState: () => "idle",
    onInit: {
      effects: ["syncSsr"],
    },
    props({props}) {
      return {
        autoComplete: "current-password",
        defaultValue: "",
        defaultVisible: false,
        dir: "ltr",
        translations: {
          visibilityTrigger: (visible) =>
            visible ? "Hide password" : "Show password",
        },
        ...props,
      }
    },
    states: {
      idle: {
        on: {
          "FOCUSED.SET": {
            actions: ["setFocused"],
          },
          "INPUT.FOCUS": {
            actions: ["focusInputEl"],
          },
          "TRIGGER.CLICK": {
            actions: ["toggleVisibility", "focusInputEl"],
          },
          "VALUE.SET": {
            actions: ["setValue"],
          },
          "VISIBILITY.SET": {
            actions: ["setVisibility"],
          },
        },
      },
    },
  })
