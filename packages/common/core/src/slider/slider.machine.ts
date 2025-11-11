import {trackElementRect} from "@qualcomm-ui/dom/dom-query"
import {
  raf,
  setElementValue,
  trackFormControl,
  trackPointerMove,
} from "@qualcomm-ui/dom/query"
import {isEqual} from "@qualcomm-ui/utils/equal"
import {createMachine, type MachineConfig} from "@qualcomm-ui/utils/machine"
import {getValuePercent, setValueAtIndex} from "@qualcomm-ui/utils/number"
import {pick} from "@qualcomm-ui/utils/object"

import {
  dispatchChangeEvent,
  domEls,
  getOffsetRect,
  getPointValue,
  getThumbEls,
} from "./slider.dom"
import type {SliderSchema} from "./slider.types"
import {
  constrainValue,
  decrement,
  getClosestIndex,
  getRangeAtIndex,
  increment,
  isEqualSize,
  normalize,
  normalizeValues,
} from "./slider.utils"

export const sliderMachine: MachineConfig<SliderSchema> =
  createMachine<SliderSchema>({
    actions: {
      clearFocusedIndex({context}) {
        context.set("focusedIndex", -1)
      },
      decrementThumbAtIndex(params) {
        const {context, event} = params
        const {index, step} = event as {index?: number; step?: number}
        const value = decrement(params, index, step)
        context.set("value", value)
      },
      dispatchChangeEvent({context, scope}) {
        dispatchChangeEvent(scope, context.get("value"))
      },
      focusActiveThumb({context, scope}) {
        raf(() => {
          const thumbEl = domEls.thumb(
            scope,
            context.get("focusedIndex").toString(),
          )
          thumbEl?.focus({preventScroll: true})
        })
      },
      incrementThumbAtIndex(params) {
        const {context, event} = params
        const {index, step} = event as {index?: number; step?: number}
        const value = increment(params, index, step)
        context.set("value", value)
      },
      invokeOnChangeEnd({context, prop}) {
        queueMicrotask(() => {
          prop("onValueChangeEnd")?.({value: context.get("value")})
        })
      },
      setClosestThumbIndex(params) {
        const {context, event} = params

        if (!("point" in event)) {
          return
        }
        const pointValue = getPointValue(params, event.point)
        if (pointValue == null) {
          return
        }

        const focusedIndex = getClosestIndex(params, pointValue)
        context.set("focusedIndex", focusedIndex)
      },
      setFocusedIndex({context, event}) {
        if (!("index" in event)) {
          return
        }
        context.set("focusedIndex", event.index as number)
      },
      setFocusedThumbToMax(params) {
        const {context} = params
        const index = context.get("focusedIndex")
        const {max} = getRangeAtIndex(params, index)
        context.set("value", (prev) => setValueAtIndex(prev, index, max))
      },
      setFocusedThumbToMin(params) {
        const {context} = params
        const index = context.get("focusedIndex")
        const {min} = getRangeAtIndex(params, index)
        context.set("value", (prev) => setValueAtIndex(prev, index, min))
      },
      setPointerValue(params) {
        queueMicrotask(() => {
          const {context, event} = params
          if (!("point" in event)) {
            return
          }
          const pointValue = getPointValue(params, event.point)
          if (pointValue == null) {
            return
          }

          const focusedIndex = context.get("focusedIndex")
          const value = constrainValue(params, pointValue, focusedIndex)
          context.set("value", (prev) =>
            setValueAtIndex(prev, focusedIndex, value),
          )
        })
      },
      setValue(params) {
        const {context, event} = params
        if (!("value" in event)) {
          return
        }
        const value = normalizeValues(params, event.value as number[])
        context.set("value", value)
      },
      setValueAtIndex(params) {
        const {context, event} = params
        if (!("index" in event && "value" in event)) {
          return
        }
        const value = constrainValue(
          params,
          event.value as number,
          event.index as number,
        )
        context.set("value", (prev) =>
          setValueAtIndex(prev, event.index as number, value),
        )
      },
      syncInputElements({context, scope}) {
        context.get("value").forEach((value, index) => {
          const inputEl = domEls.hiddenInput(scope, index.toString())
          setElementValue(inputEl as HTMLInputElement, value.toString())
        })
      },
    },

    computed: {
      hasMeasuredThumbSize: ({context}) => context.get("thumbSize") != null,
      isDisabled: ({context, prop}) =>
        !!prop("disabled") || context.get("fieldsetDisabled"),
      isHorizontal: ({prop}) => prop("orientation") === "horizontal",
      isInteractive: ({computed, prop}) =>
        !(prop("readOnly") || computed("isDisabled")),
      isRtl: ({prop}) =>
        prop("orientation") === "horizontal" && prop("dir") === "rtl",
      isVertical: ({prop}) => prop("orientation") === "vertical",
      valuePercent({context, prop}) {
        return context
          .get("value")
          .map(
            (value) => 100 * getValuePercent(value, prop("min")!, prop("max")!),
          )
      },
    },

    context({bindable, getContext, prop}) {
      return {
        fieldsetDisabled: bindable(() => ({
          defaultValue: false,
        })),
        focusedIndex: bindable(() => ({
          defaultValue: -1,
          onChange(value) {
            const ctx = getContext()
            prop("onFocusChange")?.({
              focusedIndex: value,
              value: ctx.get("value"),
            })
          },
        })),
        thumbSize: bindable(() => ({
          defaultValue: prop("thumbSize") || null,
        })),
        value: bindable(() => ({
          defaultValue: prop("defaultValue"),
          hash(a) {
            return a.join(",")
          },
          isEqual,
          onChange(value) {
            prop("onValueChange")?.({value})
          },
          value: prop("value"),
        })),
      }
    },

    effects: {
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

      trackPointerMove({scope, send}) {
        return trackPointerMove(scope.getDoc(), {
          onPointerMove(info) {
            send({point: info.point, type: "POINTER_MOVE"})
          },
          onPointerUp() {
            send({type: "POINTER_UP"})
          },
        })
      },

      trackThumbSize({context, prop, scope}): undefined | (() => void) {
        if (prop("thumbAlignment") !== "contain" || prop("thumbSize")) {
          return
        }

        return trackElementRect(getThumbEls(scope), {
          box: "border-box",
          measure(el) {
            return getOffsetRect(el)
          },
          onEntry({rects}) {
            if (rects.length === 0) {
              return
            }
            const size = pick(rects[0], ["width", "height"])
            if (isEqualSize(context.get("thumbSize"), size)) {
              return
            }
            context.set("thumbSize", size)
          },
        })
      },
    },

    guards: {
      hasIndex: ({event}) => "index" in event && event.index != null,
    },

    ids: ({bindableId, bindableIdCollection}) => {
      return {
        control: bindableId<string>(),
        errorText: bindableId<string>(),
        hiddenInput: bindableIdCollection<string>(),
        hint: bindableId<string>(),
        label: bindableId<string>(),
        marker: bindableIdCollection<string>(),
        markerGroup: bindableId<string>(),
        maxMarker: bindableId<string>(),
        minMarker: bindableId<string>(),
        range: bindableId<string>(),
        root: bindableId<string>(),
        thumb: bindableIdCollection<string>(),
        track: bindableId<string>(),
        valueText: bindableId<string>(),
      }
    },

    initialEffects: ["trackFormControlState", "trackThumbSize"],

    initialState: () => "idle",

    on: {
      DECREMENT: {
        actions: ["decrementThumbAtIndex"],
      },
      INCREMENT: {
        actions: ["incrementThumbAtIndex"],
      },
      SET_VALUE: [
        {
          actions: ["setValueAtIndex"],
          guard: "hasIndex",
        },
        {
          actions: ["setValue"],
        },
      ],
    },

    props({props}) {
      const min = props.min ?? 0
      const max = props.max ?? 100
      const step = props.step ?? 1
      const defaultValue = props.defaultValue ?? [min]
      const minStepsBetweenThumbs = props.minStepsBetweenThumbs ?? 0
      return {
        dir: "ltr",
        minStepsBetweenThumbs,
        orientation: "horizontal",
        origin: "start",
        thumbAlignment: "contain",
        ...props,
        defaultValue: normalize(
          defaultValue,
          min,
          max,
          step,
          minStepsBetweenThumbs,
        ),
        max,
        min,
        step,
        value: props.value
          ? normalize(props.value, min, max, step, minStepsBetweenThumbs)
          : undefined,
      }
    },

    states: {
      dragging: {
        effects: ["trackPointerMove"],
        entry: ["focusActiveThumb"],
        on: {
          POINTER_MOVE: {
            actions: ["setPointerValue"],
          },
          POINTER_UP: {
            actions: ["invokeOnChangeEnd"],
            target: "focus",
          },
        },
      },

      focus: {
        entry: ["focusActiveThumb"],
        on: {
          ARROW_DEC: {
            actions: ["decrementThumbAtIndex", "invokeOnChangeEnd"],
          },
          ARROW_INC: {
            actions: ["incrementThumbAtIndex", "invokeOnChangeEnd"],
          },
          BLUR: {
            actions: ["clearFocusedIndex"],
            target: "idle",
          },
          END: {
            actions: ["setFocusedThumbToMax", "invokeOnChangeEnd"],
          },
          HOME: {
            actions: ["setFocusedThumbToMin", "invokeOnChangeEnd"],
          },
          POINTER_DOWN: {
            actions: [
              "setClosestThumbIndex",
              "setPointerValue",
              "focusActiveThumb",
            ],
            target: "dragging",
          },
          THUMB_POINTER_DOWN: {
            actions: ["setFocusedIndex", "focusActiveThumb"],
            target: "dragging",
          },
        },
      },

      idle: {
        on: {
          FOCUS: {
            actions: ["setFocusedIndex"],
            target: "focus",
          },
          POINTER_DOWN: {
            actions: [
              "setClosestThumbIndex",
              "setPointerValue",
              "focusActiveThumb",
            ],
            target: "dragging",
          },
          THUMB_POINTER_DOWN: {
            actions: ["setFocusedIndex", "focusActiveThumb"],
            target: "dragging",
          },
        },
      },
    },

    watch({actions, context, track}) {
      track([() => context.hash("value")], () => {
        actions["syncInputElements"]()
        actions["dispatchChangeEvent"]()
      })
    },
  })
