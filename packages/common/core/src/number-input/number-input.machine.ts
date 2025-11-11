import {
  addDomEvent,
  observeAttributes,
  raf,
  setElementValue,
  trackFormControl,
} from "@qualcomm-ui/dom/query"
import {
  createChoose,
  createGuards,
  createMachine,
  type MachineConfig,
} from "@qualcomm-ui/utils/machine"
import {memo} from "@qualcomm-ui/utils/memo"
import {
  clampValue,
  decrementValue,
  incrementValue,
  isValueAtMax,
  isValueAtMin,
  isValueWithinRange,
} from "@qualcomm-ui/utils/number"

import {domEls, getPressedTriggerEl} from "./internal"
import type {HintValue, NumberInputSchema} from "./number-input.types"
import {
  createFormatter,
  createParser,
  formatValue,
  getDefaultStep,
  parseValue,
} from "./number-input.utils"

const {and, not} = createGuards<NumberInputSchema>()

export const numberInputMachine: MachineConfig<NumberInputSchema> =
  createMachine({
    actions: {
      clearHint({context}) {
        context.set("hint", null)
      },
      clearValue({context}) {
        context.set("value", "")
      },
      decrement({computed, context, event, prop}) {
        let nextValue = decrementValue(
          computed("valueAsNumber"),
          "step" in event ? (event.step ?? prop("step")) : prop("step"),
        )
        if (!prop("allowOverflow")) {
          nextValue = clampValue(nextValue, prop("min"), prop("max"))
        }
        context.set("value", formatValue(nextValue, {computed, prop}))
      },
      decrementToMin({computed, context, prop}) {
        const value = formatValue(prop("min"), {computed, prop})
        context.set("value", value)
      },
      focusInput({prop, scope}) {
        if (!prop("focusInputOnChange")) {
          return
        }
        const inputEl = domEls.input(scope)
        if (scope.isActiveElement(inputEl)) {
          return
        }
        raf(() => inputEl?.focus({preventScroll: true}))
      },
      increment({computed, context, event, prop}) {
        let nextValue = incrementValue(
          computed("valueAsNumber"),
          "step" in event ? (event.step ?? prop("step")) : prop("step"),
        )
        if (!prop("allowOverflow")) {
          nextValue = clampValue(nextValue, prop("min"), prop("max"))
        }
        context.set("value", formatValue(nextValue, {computed, prop}))
      },
      incrementToMax({computed, context, prop}) {
        const value = formatValue(prop("max"), {computed, prop})
        context.set("value", value)
      },
      invokeOnBlur({computed, prop}) {
        prop("onFocusChange")?.({
          focused: false,
          value: computed("formattedValue"),
          valueAsNumber: computed("valueAsNumber"),
        })
      },
      invokeOnFocus({computed, prop}) {
        prop("onFocusChange")?.({
          focused: true,
          value: computed("formattedValue"),
          valueAsNumber: computed("valueAsNumber"),
        })
      },
      invokeOnInvalid({computed, event, prop}) {
        if (event.type === "INPUT.CHANGE") {
          return
        }
        const reason =
          computed("valueAsNumber") > prop("max")
            ? "rangeOverflow"
            : "rangeUnderflow"
        prop("onValueInvalid")?.({
          reason,
          value: computed("formattedValue"),
          valueAsNumber: computed("valueAsNumber"),
        })
      },
      setClampedValue({computed, context, prop}) {
        const nextValue = clampValue(
          computed("valueAsNumber"),
          prop("min"),
          prop("max"),
        )
        context.set("value", formatValue(nextValue, {computed, prop}))
      },
      setFormattedValue({computed, context}) {
        context.set("value", computed("formattedValue"))
      },
      setHint({context, event}) {
        context.set("hint", (event as any).hint || null)
      },
      setRawValue({computed, context, event, prop}) {
        let nextValue = parseValue((event as any).value, {computed, prop})
        if (!prop("allowOverflow")) {
          nextValue = clampValue(nextValue, prop("min"), prop("max"))
        }
        context.set("value", formatValue(nextValue, {computed, prop}))
      },
      setValue({context, event}) {
        const value = (event as any).target?.value ?? (event as any).value
        context.set("value", value)
      },
      syncInputElement({computed, context, event, scope}) {
        const value = event.type.endsWith("CHANGE")
          ? context.get("value")
          : computed("formattedValue")
        const inputEl = domEls.input(scope)
        raf(() => {
          setElementValue(inputEl, value)
        })
      },
    },
    computed: {
      canDecrement: ({computed, prop}) =>
        prop("allowOverflow") || !computed("isAtMin"),
      canIncrement: ({computed, prop}) =>
        prop("allowOverflow") || !computed("isAtMax"),
      formattedValue: ({computed, prop}) =>
        formatValue(computed("valueAsNumber"), {computed, prop}),
      formatter: memo(
        ({prop}) => [prop("locale"), prop("formatOptions")],
        (locale, formatOptions) => createFormatter(locale, formatOptions),
      ),
      isAtMax: ({computed, prop}) =>
        isValueAtMax(computed("valueAsNumber"), prop("max")),
      isAtMin: ({computed, prop}) =>
        isValueAtMin(computed("valueAsNumber"), prop("min")),
      isDisabled: ({context, prop}) =>
        !!prop("disabled") || context.get("fieldsetDisabled"),
      isOutOfRange: ({computed, prop}) =>
        !isValueWithinRange(
          computed("valueAsNumber"),
          prop("min"),
          prop("max"),
        ),
      isRtl: ({prop}) => prop("dir") === "rtl",
      isValueEmpty: ({context}) => context.get("value") === "",
      parser: memo(
        ({prop}) => [prop("locale"), prop("formatOptions")],
        (locale, formatOptions) => createParser(locale, formatOptions),
      ),
      valueAsNumber: ({computed, context, prop}) =>
        parseValue(context.get("value"), {computed, prop}),
      valueText: ({context, prop}) =>
        prop("translations").valueText?.(context.get("value")),
    },
    context: ({bindable, getComputed, prop}) => {
      return {
        fieldsetDisabled: bindable<boolean>(() => ({defaultValue: false})),
        hint: bindable<HintValue | null>(() => ({defaultValue: null})),
        ssr: bindable<boolean>(() => ({defaultValue: true})),
        value: bindable<string>(() => ({
          defaultValue: prop("defaultValue"),
          onChange(value) {
            const computed = getComputed()
            const valueAsNumber = parseValue(value, {computed, prop})
            prop("onValueChange")?.({value, valueAsNumber})
          },
          value: prop("value"),
        })),
      }
    },
    effects: {
      attachWheelListener({prop, scope, send}) {
        const inputEl = domEls.input(scope)
        if (
          !inputEl ||
          !scope.isActiveElement(inputEl) ||
          !prop("allowMouseWheel")
        ) {
          return
        }

        function onWheel(event: WheelEvent) {
          event.preventDefault()
          const dir = Math.sign(event.deltaY) * -1
          if (dir === 1) {
            send({type: "VALUE.INCREMENT"})
          } else if (dir === -1) {
            send({type: "VALUE.DECREMENT"})
          }
        }

        return addDomEvent(inputEl, "wheel", onWheel, {passive: false})
      },
      spinValue({send}) {
        const id = setInterval(() => {
          send({type: "SPIN"})
        }, 50)
        return () => clearInterval(id)
      },
      trackButtonDisabled({context, scope, send}) {
        const hint = context.get("hint")
        const btn = getPressedTriggerEl(scope, hint)
        return observeAttributes(btn, {
          attributes: ["disabled"],
          callback() {
            send({src: "attr", type: "TRIGGER.PRESS_UP"})
          },
        })
      },
      trackFormControl({context, scope}) {
        return trackFormControl(domEls.input(scope), {
          onFieldsetDisabledChange: (disabled) => {
            context.set("fieldsetDisabled", disabled)
          },
          onFormReset: () => {
            context.set("value", context.initial("value")!)
          },
        })
      },
      waitForChangeDelay({send}) {
        const id = setTimeout(() => {
          send({type: "CHANGE_DELAY"})
        }, 300)
        return () => clearTimeout(id)
      },
    },
    guards: {
      clampValueOnBlur: ({prop}) => prop("clampValueOnBlur"),
      isDecrementHint: ({context, event}) =>
        ((event as any).hint ?? context.get("hint")) === "decrement",
      isIncrementHint: ({context, event}) =>
        ((event as any).hint ?? context.get("hint")) === "increment",
      isInRange: ({computed}) => !computed("isOutOfRange"),
      isTouchPointer: ({event}) =>
        "pointerType" in event && event.pointerType === "touch",
      spinOnPress: ({prop}) => !!prop("spinOnPress"),
    },
    ids: ({bindableId, ids}) => {
      return {
        decrementTrigger: bindableId<string>(ids?.decrementTrigger),
        errorText: bindableId<string>(ids?.errorText),
        hint: bindableId<string>(ids?.hint),
        incrementTrigger: bindableId<string>(ids?.incrementTrigger),
        input: bindableId<string>(ids?.input),
        label: bindableId<string>(ids?.label),
      }
    },
    initialEffects: ["trackFormControl"],
    initialState() {
      return "idle"
    },
    on: {
      "VALUE.CLEAR": {
        actions: ["clearValue"],
      },
      "VALUE.DECREMENT": {
        actions: ["decrement"],
      },
      "VALUE.INCREMENT": {
        actions: ["increment"],
      },
      "VALUE.SET": {
        actions: ["setRawValue"],
      },
    },

    props({props}) {
      const step = getDefaultStep(props.step, props.formatOptions)
      return {
        allowOverflow: false,
        clampValueOnBlur: !props.allowOverflow,
        defaultValue: "",
        dir: "ltr",
        focusInputOnChange: true,
        inputMode: "decimal",
        locale: "en-US",
        max: Number.MAX_SAFE_INTEGER,
        min: Number.MIN_SAFE_INTEGER,
        pattern: "-?[0-9]*(.[0-9]+)?",
        spinOnPress: true,
        step,
        ...props,
        translations: {
          decrementLabel: "decrease value",
          incrementLabel: "increment value",
          ...props.translations,
        },
      }
    },

    states: {
      "before:spin": {
        effects: ["trackButtonDisabled", "waitForChangeDelay"],
        entry: createChoose<NumberInputSchema>([
          {actions: ["increment"], guard: "isIncrementHint"},
          {actions: ["decrement"], guard: "isDecrementHint"},
        ]),
        on: {
          CHANGE_DELAY: {
            guard: and("isInRange", "spinOnPress"),
            target: "spinning",
          },
          "TRIGGER.PRESS_UP": [
            {
              actions: ["clearHint"],
              guard: "isTouchPointer",
              target: "focused",
            },
            {actions: ["focusInput", "clearHint"], target: "focused"},
          ],
        },
        tags: ["focus"],
      },
      focused: {
        effects: ["attachWheelListener"],
        on: {
          "INPUT.ARROW_DOWN": {
            actions: ["decrement"],
          },
          "INPUT.ARROW_UP": {
            actions: ["increment"],
          },
          "INPUT.BLUR": [
            {
              actions: ["setClampedValue", "clearHint", "invokeOnBlur"],
              guard: and("clampValueOnBlur", not("isInRange")),
              target: "idle",
            },
            {
              actions: [
                "setFormattedValue",
                "clearHint",
                "invokeOnBlur",
                "invokeOnInvalid",
              ],
              guard: not("isInRange"),
              target: "idle",
            },
            {
              actions: ["setFormattedValue", "clearHint", "invokeOnBlur"],
              target: "idle",
            },
          ],
          "INPUT.CHANGE": {
            actions: ["setValue", "setHint"],
          },
          "INPUT.END": {
            actions: ["incrementToMax"],
          },
          "INPUT.ENTER": {
            actions: ["setFormattedValue", "clearHint", "invokeOnBlur"],
          },
          "INPUT.HOME": {
            actions: ["decrementToMin"],
          },
          "TRIGGER.PRESS_DOWN": [
            {
              actions: ["setHint"],
              guard: "isTouchPointer",
              target: "before:spin",
            },
            {actions: ["focusInput", "setHint"], target: "before:spin"},
          ],
        },
        tags: ["focus"],
      },

      idle: {
        on: {
          "INPUT.FOCUS": {
            actions: ["focusInput", "invokeOnFocus"],
            target: "focused",
          },
          "TRIGGER.PRESS_DOWN": [
            {
              actions: ["setHint"],
              guard: "isTouchPointer",
              target: "before:spin",
            },
            {
              actions: ["focusInput", "invokeOnFocus", "setHint"],
              target: "before:spin",
            },
          ],
        },
      },
      spinning: {
        effects: ["trackButtonDisabled", "spinValue"],
        on: {
          SPIN: [
            {
              actions: ["increment"],
              guard: "isIncrementHint",
            },
            {
              actions: ["decrement"],
              guard: "isDecrementHint",
            },
          ],
          "TRIGGER.PRESS_UP": {
            actions: ["focusInput", "clearHint"],
            target: "focused",
          },
        },
        tags: ["focus"],
      },
    },
    watch({action, computed, context, prop, track}) {
      track([() => context.get("value"), () => prop("locale")], () => {
        action(["syncInputElement"])
      })

      track([() => computed("isOutOfRange")], () => {
        action(["invokeOnInvalid"])
      })
    },
  })
