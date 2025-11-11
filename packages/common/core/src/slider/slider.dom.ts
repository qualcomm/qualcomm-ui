import {
  dispatchInputValueEvent,
  getRelativePoint,
  queryAll,
} from "@qualcomm-ui/dom/query"
import type {Point} from "@qualcomm-ui/dom/rect-utils"
import type {
  Params,
  ScopeDomElements,
  ScopeDomIds,
  ScopeWithIds,
} from "@qualcomm-ui/utils/machine"
import {getPercentValue} from "@qualcomm-ui/utils/number"

import type {SliderElementIds, SliderSchema} from "./slider.types"

type Scope = ScopeWithIds<SliderSchema>

export const domIds: ScopeDomIds<SliderElementIds, Scope> = {
  control: (scope) => scope.ids.get("control"),
  errorText: (scope) => scope.ids.get("errorText"),
  hiddenInput: (scope, key) => scope.ids.collection("hiddenInput").get(key),
  hint: (scope) => scope.ids.get("hint"),
  label: (scope) => scope.ids.get("label"),
  marker: (scope, key) => scope.ids.collection("marker").get(key),
  markerGroup: (scope) => scope.ids.get("markerGroup"),
  maxMarker: (scope) => scope.ids.get("maxMarker"),
  minMarker: (scope) => scope.ids.get("minMarker"),
  range: (scope) => scope.ids.get("range"),
  root: (scope) => scope.ids.get("root"),
  thumb: (scope, key) => scope.ids.collection("thumb").get(key),
  track: (scope) => scope.ids.get("track"),
  valueText: (scope) => scope.ids.get("valueText"),
}

export const domEls: ScopeDomElements<SliderElementIds, Scope> = {
  control: (scope) => scope.getById(domIds.control(scope)),
  errorText: (scope) => scope.getById(domIds.errorText(scope)),
  hiddenInput: (scope, key) => scope.getById(domIds.hiddenInput(scope, key)!),
  hint: (scope) => scope.getById(domIds.hint(scope)),
  label: (scope) => scope.getById(domIds.label(scope)),
  marker: (scope, key) => scope.getById(domIds.marker(scope, key)!),
  markerGroup: (scope) => scope.getById(domIds.markerGroup(scope)),
  maxMarker: (scope) => scope.getById(domIds.maxMarker(scope)),
  minMarker: (scope) => scope.getById(domIds.minMarker(scope)),
  range: (scope) => scope.getById(domIds.range(scope)),
  root: (scope) => scope.getById(domIds.root(scope)),
  thumb: (scope, key) => scope.getById(domIds.thumb(scope, key)!),
  track: (scope) => scope.getById(domIds.track(scope)),
  valueText: (scope) => scope.getById(domIds.valueText(scope)),
}

export const getThumbEls = (scope: Scope): HTMLElement[] =>
  queryAll(domEls.control(scope), "[role=slider]")

export const getFirstThumbEl = (scope: Scope): HTMLElement =>
  getThumbEls(scope)[0]

export const getPointValue = (
  params: Params<SliderSchema>,
  point: Point,
): number | undefined => {
  const {prop, scope} = params
  const controlEl = domEls.control(scope)
  if (!controlEl) {
    return
  }
  const relativePoint = getRelativePoint(point, controlEl)
  const percent = relativePoint.getPercentValue({
    dir: prop("dir"),
    inverted: {y: true},
    orientation: prop("orientation"),
  })
  return getPercentValue(percent, prop("min")!, prop("max")!, prop("step")!)
}

export const dispatchChangeEvent = (scope: Scope, value: number[]): void => {
  value.forEach((value, index) => {
    const inputEl = domEls.hiddenInput(scope, index.toString())
    if (!inputEl) {
      return
    }
    dispatchInputValueEvent(inputEl as HTMLInputElement, {value})
  })
}

export const getOffsetRect = (
  el: HTMLElement | undefined,
): {height: number; left: number; top: number; width: number} => ({
  height: el?.offsetHeight ?? 0,
  left: el?.offsetLeft ?? 0,
  top: el?.offsetTop ?? 0,
  width: el?.offsetWidth ?? 0,
})
