import {trackFormControl} from "@qualcomm-ui/dom/query"
import {createMachine, type MachineConfig} from "@qualcomm-ui/utils/machine"

import {domEls} from "./internal"
import type {TextInputSchema} from "./text-input.types"

export const textInputMachine: MachineConfig<TextInputSchema> = createMachine({
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
      value: bindable<string>(() => ({
        defaultValue: prop("defaultValue"),
        onChange: prop("onValueChange"),
        value: prop("value"),
      })),
    }
  },
  effects: {
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
    }
  },
  initialState: () => "idle",
  props({props}) {
    return {
      defaultValue: "",
      dir: "ltr",
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
        "VALUE.SET": {
          actions: ["setValue"],
        },
      },
    },
  },
})
