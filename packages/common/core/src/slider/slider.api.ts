// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  getEventKey,
  getEventPoint,
  getEventStep,
  isLeftClick,
  isModifierKey,
} from "@qualcomm-ui/dom/query"
import {ensureArray, first, last} from "@qualcomm-ui/utils/array"
import {booleanAriaAttr, booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {
  EventKeyMap,
  Machine,
  PropNormalizer,
} from "@qualcomm-ui/utils/machine"
import {getPercentValue, getValuePercent} from "@qualcomm-ui/utils/number"

import {sliderAnatomy} from "./slider.anatomy.js"
import {domIds, getFirstThumbEl} from "./slider.dom.js"
import {
  getControlStyle,
  getMarkerGroupStyle,
  getMarkerStyle,
  getRangeStyle,
  getRootStyle,
  getThumbStyle,
} from "./slider.style.js"
import type {
  SliderApi,
  SliderControlBindings,
  SliderErrorTextBindings,
  SliderHiddenInputBindings,
  SliderHintBindings,
  SliderMarkerBindings,
  SliderMarkerGroupBindings,
  SliderMaxMarkerBindings,
  SliderMinMarkerBindings,
  SliderRangeBindings,
  SliderRootBindings,
  SliderSchema,
  SliderThumbBindings,
  SliderThumbIndicatorBindings,
  SliderTrackBindings,
  SliderValueTextBindings,
} from "./slider.types.js"
import {getRangeAtIndex} from "./slider.utils.js"

export function createSliderApi(
  store: Machine<SliderSchema>,
  normalize: PropNormalizer,
): SliderApi {
  const {computed, context, prop, scope, send, state} = store

  const ariaLabel = prop("aria-label")
  const ariaLabelledBy = prop("aria-labelledby")

  const sliderValue = context.get("value")
  const focusedIndex = context.get("focusedIndex")

  const focused = state.matches("focus")
  const dragging = state.matches("dragging")

  const readOnly = prop("readOnly")
  const disabled = computed("isDisabled")
  const invalid = !!prop("invalid")
  const interactive = computed("isInteractive")

  const isHorizontal = prop("orientation") === "horizontal"
  const isVertical = prop("orientation") === "vertical"

  function getValuePercentFn(value: number) {
    return getValuePercent(value, prop("min"), prop("max"))
  }

  function getPercentValueFn(percent: number) {
    return getPercentValue(percent, prop("min"), prop("max"), prop("step"))
  }

  function getDefaultMarks(count = 11): number[] {
    const max = prop("max")
    const min = prop("min")

    if (max <= min) {
      return [min]
    }
    const step = (max - min) / (count - 1)
    return Array.from(
      {length: count},
      (_, i) => Math.round((min + i * step) * 100) / 100,
    )
  }

  const parts = sliderAnatomy.parts

  return {
    decrement(index) {
      send({index, type: "DECREMENT"})
    },
    dragging,
    focus() {
      if (!interactive) {
        return
      }
      send({index: 0, type: "FOCUS"})
    },
    focused,
    focusedIndex,
    getDefaultMarks,
    getPercentValue: getPercentValueFn,
    getThumbMax(index) {
      return getRangeAtIndex(store, index).max
    },
    getThumbMin(index) {
      return getRangeAtIndex(store, index).min
    },
    getThumbPercent(index) {
      return getValuePercentFn(sliderValue[index])
    },
    getThumbValue(index) {
      return sliderValue[index]
    },
    getValuePercent: getValuePercentFn,
    increment(index) {
      send({index, type: "INCREMENT"})
    },
    max: prop("max"),
    min: prop("min"),
    setThumbPercent(index, percent) {
      const value = getPercentValueFn(percent)
      send({index, type: "SET_VALUE", value})
    },
    setThumbValue(index, value) {
      send({index, type: "SET_VALUE", value})
    },
    setValue(value) {
      send({type: "SET_VALUE", value})
    },
    value: sliderValue,

    // group: bindings

    getControlBindings(props): SliderControlBindings {
      scope.ids.register("control", props)
      return normalize.element({
        ...parts.control,
        "data-disabled": booleanDataAttr(disabled),
        "data-dragging": booleanDataAttr(dragging),
        "data-focus": booleanDataAttr(focused),
        "data-invalid": booleanDataAttr(invalid),
        "data-orientation": prop("orientation"),
        "data-readonly": booleanDataAttr(readOnly),
        dir: prop("dir"),
        id: props.id,
        max: prop("max"),
        min: prop("min"),
        onPointerDown(event) {
          if (!interactive) {
            return
          }
          if (!isLeftClick(event)) {
            return
          }
          if (isModifierKey(event)) {
            return
          }

          const point = getEventPoint(event)
          send({point, type: "POINTER_DOWN"})

          event.preventDefault()
          event.stopPropagation()
        },
        style: getControlStyle(),
      })
    },
    getErrorTextBindings(props): SliderErrorTextBindings {
      scope.ids.register("errorText", props)
      return normalize.label({
        ...parts.errorText,
        "data-disabled": booleanDataAttr(disabled),
        "data-dragging": booleanDataAttr(dragging),
        "data-invalid": booleanDataAttr(invalid),
        "data-orientation": prop("orientation"),
        dir: prop("dir"),
        hidden: !invalid,
        id: props.id,
      })
    },
    getHiddenInputBindings({
      id,
      index = 0,
      name,
      onDestroy,
    }): SliderHiddenInputBindings {
      scope.ids
        .collection("hiddenInput")
        .register(index.toString(), id, onDestroy)
      const globalName = prop("name")
      let inputName: string | undefined

      if (name) {
        inputName = name
      } else if (typeof globalName === "string") {
        if (sliderValue.length === 1) {
          inputName = globalName
        } else if (sliderValue.length === 2) {
          inputName = globalName + index
        }
      } else if (Array.isArray(globalName)) {
        if (sliderValue.length === 1) {
          inputName = globalName[0]
        } else if (sliderValue.length === 2) {
          inputName = globalName[index]
        }
      }

      return normalize.input({
        defaultValue: sliderValue[index],
        dir: prop("dir"),
        form: prop("form"),
        hidden: true,
        id,
        name: inputName,
        type: "text",
      })
    },
    getHintBindings(props): SliderHintBindings {
      scope.ids.register("hint", props)
      return normalize.label({
        ...parts.hint,
        "aria-live": "polite",
        "data-disabled": booleanDataAttr(disabled),
        "data-dragging": booleanDataAttr(dragging),
        "data-invalid": booleanDataAttr(invalid),
        "data-orientation": prop("orientation"),
        "data-readonly": booleanDataAttr(readOnly),
        dir: prop("dir"),
        hidden: invalid,
        id: props.id,
      })
    },
    getLabelBindings(props) {
      scope.ids.register("label", props)
      return normalize.label({
        ...parts.label,
        "data-disabled": booleanDataAttr(disabled),
        "data-dragging": booleanDataAttr(dragging),
        "data-focus": booleanDataAttr(focused),
        "data-invalid": booleanDataAttr(invalid),
        "data-orientation": prop("orientation"),
        "data-readonly": booleanDataAttr(readOnly),
        dir: prop("dir"),
        htmlFor: scope.ids.collection("hiddenInput").get("0"),
        id: props.id,
        onClick(event) {
          if (!interactive) {
            return
          }
          event.preventDefault()
          getFirstThumbEl(scope)?.focus()
        },
        style: {
          userSelect: "none",
          WebkitUserSelect: "none",
        },
      })
    },
    getMarkerBindings({id, onDestroy, value}): SliderMarkerBindings {
      scope.ids.collection("marker").register(value.toString(), id, onDestroy)

      const style = getMarkerStyle(store, value)
      let markerState: "over-value" | "under-value" | "at-value"

      if (value < first(sliderValue)!) {
        markerState = "under-value"
      } else if (value > last(sliderValue)!) {
        markerState = "over-value"
      } else {
        markerState = "at-value"
      }

      return normalize.element({
        ...parts.marker,
        "data-disabled": booleanDataAttr(disabled),
        "data-orientation": prop("orientation"),
        "data-readonly": booleanDataAttr(readOnly),
        "data-state": markerState,
        "data-value": value,
        dir: prop("dir"),
        id,
        role: "presentation",
        style,
      })
    },
    getMarkerGroupBindings(props): SliderMarkerGroupBindings {
      scope.ids.register("markerGroup", props)
      return normalize.element({
        ...parts.markerGroup,
        "aria-hidden": true,
        "data-orientation": prop("orientation"),
        dir: prop("dir"),
        id: props.id,
        role: "presentation",
        style: getMarkerGroupStyle(),
      })
    },
    getMaxMarkerBindings(props): SliderMaxMarkerBindings {
      scope.ids.register("maxMarker", props)
      return normalize.element({
        ...parts.max,
        "data-disabled": booleanDataAttr(disabled),
        "data-orientation": prop("orientation"),
        "data-readonly": booleanDataAttr(readOnly),
        "data-value": prop("max"),
        dir: prop("dir"),
        id: props.id,
        role: "presentation",
      })
    },
    getMinMarkerBindings(props): SliderMinMarkerBindings {
      scope.ids.register("minMarker", props)
      return normalize.element({
        ...parts.min,
        "data-disabled": booleanDataAttr(disabled),
        "data-orientation": prop("orientation"),
        "data-readonly": booleanDataAttr(readOnly),
        "data-value": prop("min"),
        dir: prop("dir"),
        id: props.id,
        role: "presentation",
      })
    },
    getRangeBindings(props): SliderRangeBindings {
      scope.ids.register("range", props)
      return normalize.element({
        ...parts.range,
        "data-disabled": booleanDataAttr(disabled),
        "data-dragging": booleanDataAttr(dragging),
        "data-focus": booleanDataAttr(focused),
        "data-invalid": booleanDataAttr(invalid),
        "data-orientation": prop("orientation"),
        "data-readonly": booleanDataAttr(readOnly),
        dir: prop("dir"),
        id: props.id,
        style: getRangeStyle(store),
      })
    },
    getRootBindings(props): SliderRootBindings {
      scope.ids.register("root", props)
      return normalize.element({
        ...parts.root,
        "data-disabled": booleanDataAttr(disabled),
        "data-dragging": booleanDataAttr(dragging),
        "data-focus": booleanDataAttr(focused),
        "data-invalid": booleanDataAttr(invalid),
        "data-orientation": prop("orientation"),
        "data-readonly": booleanDataAttr(readOnly),
        dir: prop("dir"),
        id: props.id,
        style: getRootStyle(store),
      })
    },
    getThumbBindings({id, index = 0, name, onDestroy}): SliderThumbBindings {
      scope.ids.collection("thumb").register(index.toString(), id, onDestroy)

      const value = sliderValue[index]
      const range = getRangeAtIndex(store, index)
      const valueText = prop("getAriaValueText")?.({index, value})
      const _ariaLabel = ensureArray(ariaLabel)[index]
      const _ariaLabelledBy = ensureArray(ariaLabelledBy)[index]

      return normalize.element({
        ...parts.thumb,
        "aria-describedby": domIds.hint(scope),
        "aria-disabled": booleanAriaAttr(disabled),
        "aria-label": _ariaLabel,
        "aria-labelledby": _ariaLabelledBy ?? domIds.label(scope),
        "aria-orientation": prop("orientation"),
        "aria-valuemax": range.max,
        "aria-valuemin": range.min,
        "aria-valuenow": sliderValue[index],
        "aria-valuetext": valueText,
        "data-disabled": booleanDataAttr(disabled),
        "data-dragging": booleanDataAttr(dragging && focusedIndex === index),
        "data-focus": booleanDataAttr(focused && focusedIndex === index),
        "data-index": index,
        "data-name": name,
        "data-orientation": prop("orientation"),
        "data-readonly": booleanDataAttr(readOnly),
        dir: prop("dir"),
        draggable: false,
        id,
        onBlur() {
          if (!interactive) {
            return
          }
          send({type: "BLUR"})
        },
        onFocus() {
          if (!interactive) {
            return
          }
          send({index, type: "FOCUS"})
        },
        onKeyDown(event) {
          if (event.defaultPrevented) {
            return
          }
          if (!interactive) {
            return
          }

          const step = getEventStep(event) * prop("step")

          const keyMap: EventKeyMap = {
            ArrowDown() {
              if (isHorizontal) {
                return
              }
              send({src: "ArrowDown", step, type: "ARROW_DEC"})
            },
            ArrowLeft() {
              if (isVertical) {
                return
              }
              send({src: "ArrowLeft", step, type: "ARROW_DEC"})
            },
            ArrowRight() {
              if (isVertical) {
                return
              }
              send({src: "ArrowRight", step, type: "ARROW_INC"})
            },
            ArrowUp() {
              if (isHorizontal) {
                return
              }
              send({src: "ArrowUp", step, type: "ARROW_INC"})
            },
            End() {
              send({type: "END"})
            },
            Home() {
              send({type: "HOME"})
            },
            PageDown() {
              send({src: "PageDown", step, type: "ARROW_DEC"})
            },
            PageUp() {
              send({src: "PageUp", step, type: "ARROW_INC"})
            },
          }

          const key = getEventKey(event, {
            dir: prop("dir"),
            orientation: prop("orientation"),
          })
          const exec = keyMap[key]

          if (exec) {
            exec(event)
            event.preventDefault()
            event.stopPropagation()
          }
        },
        onPointerDown(event) {
          if (!interactive) {
            return
          }
          if (!isLeftClick(event)) {
            return
          }

          const thumbEl = event.currentTarget as HTMLElement
          const rect = thumbEl.getBoundingClientRect()
          const midpoint = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          }
          const offset = {
            x: event.clientX - midpoint.x,
            y: event.clientY - midpoint.y,
          }

          send({index, offset, type: "THUMB_POINTER_DOWN"})
          event.stopPropagation()
        },
        role: "slider",
        style: getThumbStyle(store, index),
        tabIndex: disabled ? undefined : 0,
      })
    },
    getThumbIndicatorBindings({
      id,
      index = 0,
      onDestroy,
    }): SliderThumbIndicatorBindings {
      scope.ids
        .collection("thumbIndicator")
        .register(index.toString(), id, onDestroy)
      return normalize.element({
        ...parts.thumbIndicator,
        "data-orientation": prop("orientation"),
        dir: prop("dir"),
        role: "presentation",
        style: getThumbStyle(store, index),
      })
    },
    getTrackBindings(props): SliderTrackBindings {
      scope.ids.register("track", props)
      return normalize.element({
        ...parts.track,
        "data-disabled": booleanDataAttr(disabled),
        "data-dragging": booleanDataAttr(dragging),
        "data-focus": booleanDataAttr(focused),
        "data-invalid": booleanDataAttr(invalid),
        "data-orientation": prop("orientation"),
        "data-readonly": booleanDataAttr(readOnly),
        dir: prop("dir"),
        id: props.id,
        style: {position: "relative"},
      })
    },
    getValueTextBindings(props): SliderValueTextBindings {
      scope.ids.register("valueText", props)
      return normalize.element({
        ...parts.valueText,
        "data-disabled": booleanDataAttr(disabled),
        "data-focus": booleanDataAttr(focused),
        "data-invalid": booleanDataAttr(invalid),
        "data-orientation": prop("orientation"),
        "data-readonly": booleanDataAttr(readOnly),
        dir: prop("dir"),
        id: props.id,
        value: sliderValue,
      })
    },
  }
}
