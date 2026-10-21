// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {trackElementRect} from "@qualcomm-ui/dom/dom-query"
import {
  addDomEvent,
  getEventPoint,
  getEventTarget,
} from "@qualcomm-ui/dom/query"
import {
  addPoints,
  distance,
  type Point,
  type Size,
  subtractPoints,
} from "@qualcomm-ui/dom/rect-utils"
import {callAll} from "@qualcomm-ui/utils/functions"
import {
  createNarrowedMachine,
  type MachineConfig,
  type MachineConfigBase,
} from "@qualcomm-ui/utils/machine"
import {clampValue} from "@qualcomm-ui/utils/number"

import {measureImageViewerViewport, trackViewport} from "./image-viewer.dom.js"
import type {
  BoundingRect,
  FlipState,
  ImageViewerSchema,
} from "./image-viewer.types.js"
import {
  clampOffset,
  getFittedImageSize,
  getKeyboardMoveDelta,
  getMidpoint,
  getNudgeStep,
  getViewportCenter,
  isEqualFlip,
  isVisibleRect,
  MIN_PINCH_DISTANCE,
  normalizeFlipState,
  ZERO_POINT,
} from "./utils/crop.js"

const imageViewerMachineBase = {
  computed: {
    imageSize: ({context}) =>
      getFittedImageSize(
        context.get("naturalSize"),
        context.get("viewportRect"),
        context.get("rotation"),
      ),
    isImageReady: ({context}) =>
      context.get("imageReady") && isVisibleRect(context.get("naturalSize")),
    isMeasured: ({context}) => isVisibleRect(context.get("viewportRect")),
  },
  context({bindable, prop}) {
    return {
      flip: bindable<FlipState>(() => {
        const defaultFlip = prop("defaultFlip")
        return {
          defaultValue: {...defaultFlip},
          onChange(flip) {
            prop("onFlipChange")?.({flip})
          },
          value: prop("flip"),
        }
      }),
      imageReady: bindable<boolean>(() => ({defaultValue: false})),
      naturalSize: bindable<Size>(() => ({
        defaultValue: {height: 0, width: 0},
      })),
      offset: bindable<Point>(() => ({
        defaultValue: ZERO_POINT,
      })),
      offsetStart: bindable<Point | null>(() => ({
        defaultValue: null,
      })),
      open: bindable<boolean>(() => ({
        defaultValue: prop("defaultOpen"),
        onChange(open) {
          prop("onOpenChange")?.(open)
        },
        value: prop("open"),
      })),
      pinchDistance: bindable<number | null>(() => ({
        defaultValue: null,
      })),
      pinchMidpoint: bindable<Point | null>(() => ({
        defaultValue: null,
      })),
      pointerStart: bindable<Point | null>(() => ({
        defaultValue: null,
      })),
      rotation: bindable<number>(() => ({
        defaultValue: prop("defaultRotation"),
        onChange(rotation) {
          prop("onRotationChange")?.({rotation})
        },
        value: prop("rotation"),
      })),
      viewportRect: bindable<BoundingRect>(() => ({
        defaultValue: {
          bottom: 0,
          height: 0,
          left: 0,
          right: 0,
          top: 0,
          width: 0,
        },
      })),
      zoom: bindable<number>(() => ({
        defaultValue: prop("zoom") ?? prop("defaultZoom"),
        onChange(zoom) {
          prop("onZoomChange")?.({zoom})
        },
      })),
    }
  },
  effects: {
    trackPointerMove({scope, send}) {
      function onPointerMove(event: PointerEvent) {
        const point = getEventPoint(event)
        const target = getEventTarget<Element>(event)
        send({
          altKey: event.altKey,
          point,
          shiftKey: event.shiftKey,
          target,
          type: "POINTER_MOVE",
        })
      }

      function onPointerUp() {
        send({type: "POINTER_UP"})
      }

      return callAll(
        addDomEvent(scope.getDoc(), "pointermove", onPointerMove),
        addDomEvent(scope.getDoc(), "pointerup", onPointerUp),
        addDomEvent(scope.getDoc(), "pointercancel", onPointerUp),
      )
    },
    trackTouchEvents({scope, send}) {
      return trackViewport(scope, (viewportEl) => {
        function onTouchStart(event: TouchEvent) {
          if (event.touches.length >= 2) {
            event.preventDefault()

            const touches = Array.from(event.touches).map((touch) => ({
              x: touch.clientX,
              y: touch.clientY,
            }))

            send({touches, type: "PINCH_START"})
          }
        }

        function onTouchMove(event: TouchEvent) {
          if (event.touches.length >= 2) {
            event.preventDefault()

            const touches = Array.from(event.touches).map((touch) => ({
              x: touch.clientX,
              y: touch.clientY,
            }))

            send({touches, type: "PINCH_MOVE"})
          }
        }

        function onTouchEnd(event: TouchEvent) {
          if (event.touches.length < 2) {
            send({type: "PINCH_END"})
          }
        }

        return callAll(
          addDomEvent(viewportEl, "touchstart", onTouchStart, {passive: false}),
          addDomEvent(viewportEl, "touchmove", onTouchMove, {passive: false}),
          addDomEvent(viewportEl, "touchend", onTouchEnd),
          addDomEvent(viewportEl, "touchcancel", onTouchEnd),
        )
      })
    },
    trackViewportResize({scope, send}) {
      return trackViewport(scope, (viewportEl) => {
        return trackElementRect([viewportEl], {
          measure(el) {
            return el.getBoundingClientRect()
          },
          onEntry() {
            send({src: "resize", type: "VIEWPORT_RESIZE"})
          },
        })
      })
    },
    trackWheelEvent({scope, send}) {
      return trackViewport(scope, (viewportEl) => {
        function onWheel(event: WheelEvent) {
          event.preventDefault()

          const rect = viewportEl.getBoundingClientRect()
          const point = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          }

          send({delta: event.deltaY, point, trigger: "wheel", type: "ZOOM"})
        }

        return addDomEvent(viewportEl, "wheel", onWheel, {passive: false})
      })
    },
  },
  ids({bindableId, ids}) {
    return {
      root: bindableId<string>(ids?.root),
      viewport: bindableId<string>(ids?.viewport),
      viewportImage: bindableId<string>(ids?.viewportImage),
    }
  },
  initialState({prop}) {
    return (prop("open") ?? prop("defaultOpen")) ? "idle" : "closed"
  },
  on: {
    CLOSE: {target: "closed"},
    PINCH_END: {
      actions: ["clearPinchDistance"],
    },
    PINCH_MOVE: {
      actions: ["handlePinchMove"],
      guard: "canPan",
    },
    PINCH_START: {
      actions: ["setPinchDistance"],
      guard: "canPan",
    },
    RESET: {
      actions: ["resetToInitialState"],
    },
    SET_FLIP: {
      actions: ["setFlip"],
    },
    SET_OPEN: {actions: ["setOpen"]},
    SET_ROTATION: {
      actions: ["setRotation"],
    },
    SET_ZOOM: {
      actions: ["updateZoom"],
    },
    VIEWPORT_RESIZE: {
      actions: ["resizeViewport"],
    },
  },
  props({props}) {
    return {
      defaultFlip: {horizontal: false, vertical: false},
      defaultOpen: false,
      defaultRotation: 0,
      defaultZoom: 1,
      maxZoom: 5,
      minZoom: 1,
      nudgeStep: 1,
      nudgeStepCtrl: 50,
      nudgeStepShift: 10,
      zoomSensitivity: 2,
      zoomStep: 0.1,
      ...props,
    }
  },
  states: {
    closed: {
      entry: ["resetPan", "resetToInitialState"],
      on: {OPEN: {target: "idle"}},
    },
    idle: {
      effects: ["trackViewportResize", "trackWheelEvent", "trackTouchEvents"],
      on: {
        NUDGE_PAN: {
          actions: ["nudgePan"],
          guard: "hasViewportRect",
        },
        PAN_POINTER_DOWN: {
          actions: ["setPointerStart", "setOffsetStart"],
          guard: "canPan",
          target: "panning",
        },
        ZOOM: {
          actions: ["updateZoom"],
          guard: "hasViewportRect",
        },
      },
    },
    panning: {
      effects: ["trackPointerMove", "trackTouchEvents", "trackViewportResize"],
      on: {
        POINTER_MOVE: {
          actions: ["updatePanOffset"],
        },
        POINTER_UP: {
          actions: ["clearPointerStart", "clearOffsetStart"],
          target: "idle",
        },
      },
    },
  },
  watch({context, prop, send, track}) {
    track([() => context.get("open")], () => {
      send({type: context.get("open") ? "OPEN" : "CLOSE"})
    })
    track(
      [
        () => context.get("rotation"),
        () => context.get("naturalSize").width,
        () => context.get("naturalSize").height,
      ],
      () => {
        const viewportSize = context.get("viewportRect")
        const rotation = context.get("rotation")
        context.set(
          "offset",
          clampOffset({
            imageSize: getFittedImageSize(
              context.get("naturalSize"),
              viewportSize,
              rotation,
            ),
            offset: context.get("offset"),
            rotation,
            viewportSize,
            zoom: context.get("zoom"),
          }),
        )
      },
    )
    track([() => prop("zoom")], () => {
      const propZoom = prop("zoom")
      if (propZoom === undefined) {
        return
      }

      const currentZoom = context.get("zoom")
      if (propZoom === currentZoom) {
        return
      }

      send({src: "prop", type: "SET_ZOOM", zoom: propZoom})
    })
  },
} satisfies MachineConfigBase<ImageViewerSchema>

export const imageViewerMachine: MachineConfig<ImageViewerSchema> =
  createNarrowedMachine<ImageViewerSchema>()(imageViewerMachineBase, {
    actions: {
      clearOffsetStart({context}) {
        context.set("offsetStart", null)
      },
      clearPinchDistance({context}) {
        context.set("pinchDistance", null)
        context.set("pinchMidpoint", null)
      },
      clearPointerStart({context}) {
        context.set("pointerStart", null)
      },
      handlePinchMove({context, event, send}) {
        const touches = Array.isArray(event.touches) ? event.touches : []
        if (touches.length < 2) {
          return
        }

        const [first, second] = touches
        const touchDistance = distance(first, second)

        const lastDistance = context.get("pinchDistance")
        const lastMidpoint = context.get("pinchMidpoint")
        const viewportRect = context.get("viewportRect")

        const midpoint = getMidpoint(first, second, {
          x: viewportRect.left,
          y: viewportRect.top,
        })

        if (lastDistance != null && lastDistance > 0 && lastMidpoint != null) {
          const delta = lastDistance - touchDistance
          const scale = touchDistance / lastDistance
          const distanceChange = Math.abs(delta)

          // Improve smoothing by ignoring very small changes
          const hasSignificantZoom = distanceChange > MIN_PINCH_DISTANCE

          const panDelta = subtractPoints(midpoint, lastMidpoint)

          send({
            delta,
            panDelta,
            point: midpoint,
            scale: hasSignificantZoom ? scale : 1,
            trigger: "touch",
            type: "ZOOM",
          })
        }

        context.set("pinchDistance", touchDistance)
        context.set("pinchMidpoint", midpoint)
      },
      nudgePan({computed, context, event, prop}) {
        const {ctrlKey, key, metaKey, shiftKey} = event
        const zoom = context.get("zoom")
        const rotation = context.get("rotation")
        const viewportRect = context.get("viewportRect")

        const step = getNudgeStep(prop, {ctrlKey, metaKey, shiftKey})
        const delta = getKeyboardMoveDelta(key, step)

        const nextOffset = clampOffset({
          imageSize: computed("imageSize"),
          offset: addPoints(context.get("offset"), delta),
          rotation,
          viewportSize: viewportRect,
          zoom,
        })

        context.set("offset", nextOffset)
      },
      resetPan({context}) {
        context.set("imageReady", false)
        context.set("viewportRect", context.initial("viewportRect")!)
        context.set("offset", ZERO_POINT)
        context.set("pointerStart", null)
        context.set("offsetStart", null)
        context.set("pinchDistance", null)
        context.set("pinchMidpoint", null)
      },
      resetToInitialState({context}) {
        context.set("zoom", context.initial("zoom")!)
        context.set("rotation", context.initial("rotation")!)
        context.set("flip", context.initial("flip")!)
        context.set("offset", ZERO_POINT)
      },
      resizeViewport: measureImageViewerViewport,
      setFlip({context, event}) {
        const nextFlip = event.flip
        if (!nextFlip) {
          return
        }
        const currentFlip = context.get("flip")
        const normalized = normalizeFlipState(nextFlip, currentFlip)
        if (isEqualFlip(normalized, currentFlip)) {
          return
        }
        context.set("flip", normalized)
      },
      setOffsetStart({context}) {
        const offset = context.get("offset")
        context.set("offsetStart", {...offset})
      },
      setOpen({context, event}) {
        context.set("open", event.open)
      },
      setPinchDistance({context, event, send}) {
        const touches = Array.isArray(event.touches) ? event.touches : []
        if (touches.length < 2) {
          return
        }
        if (context.get("pointerStart") !== null) {
          send({src: "pinch", type: "POINTER_UP"})
        }
        const [first, second] = touches
        const touchDistance = distance(first, second)

        const viewportRect = context.get("viewportRect")
        const midpoint = getMidpoint(first, second, {
          x: viewportRect.left,
          y: viewportRect.top,
        })

        context.set("pinchDistance", touchDistance)
        context.set("pinchMidpoint", midpoint)
      },
      setPointerStart({context, event}) {
        const point = event.point
        if (!point) {
          return
        }

        context.set("pointerStart", point)
      },
      setRotation({context, event}) {
        const rotation = event.rotation
        const nextRotation = clampValue(rotation, 0, 360)
        context.set("rotation", nextRotation)
      },
      updatePanOffset({computed, context, event}) {
        const point = event.point
        const pointerStart = context.get("pointerStart")
        const offsetStart = context.get("offsetStart")

        if (!point || !pointerStart || !offsetStart) {
          return
        }

        const zoom = context.get("zoom")
        const rotation = context.get("rotation")
        const viewportRect = context.get("viewportRect")

        const delta = subtractPoints(point, pointerStart)

        const nextOffset = clampOffset({
          imageSize: computed("imageSize"),
          offset: addPoints(offsetStart, delta),
          rotation,
          viewportSize: viewportRect,
          zoom,
        })

        context.set("offset", nextOffset)
      },
      updateZoom({computed, context, event, prop}) {
        const targetZoom = event.type === "SET_ZOOM" ? event.zoom : undefined
        const delta = event.type === "ZOOM" ? event.delta : undefined
        const touchEvent =
          event.type === "ZOOM" && event.trigger === "touch" ? event : undefined
        const scale = touchEvent?.scale
        const panDelta = touchEvent?.panDelta
        let point =
          event.type === "ZOOM" && event.trigger !== "keyboard"
            ? event.point
            : undefined
        const currentZoom = context.get("zoom")
        const currentOffset = context.get("offset")
        const rotation = context.get("rotation")
        const viewportRect = context.get("viewportRect")

        if (!point) {
          point = getViewportCenter(viewportRect)
        }

        const step = Math.abs(prop("zoomStep"))
        const sensitivity = Math.max(0, prop("zoomSensitivity"))
        const [minZoom, maxZoom] = [prop("minZoom"), prop("maxZoom")]

        const calculateNextZoom = (): number | null => {
          if (typeof targetZoom === "number") {
            return clampValue(targetZoom, minZoom, maxZoom)
          }

          if (touchEvent && typeof scale === "number") {
            const minScale = 0.5
            const maxScale = 2
            const clampedScale = clampValue(scale, minScale, maxScale)
            const smoothing =
              sensitivity > 0
                ? Math.pow(clampedScale, sensitivity)
                : clampedScale
            return clampValue(currentZoom * smoothing, minZoom, maxZoom)
          }

          if (typeof delta === "number") {
            const direction = Math.sign(delta) < 0 ? 1 : -1
            return clampValue(currentZoom + step * direction, minZoom, maxZoom)
          }

          return null
        }

        const applyClampedOffset = (zoom: number, offset: Point): Point => {
          return clampOffset({
            imageSize: computed("imageSize"),
            offset,
            rotation,
            viewportSize: viewportRect,
            zoom,
          })
        }

        const nextZoom = calculateNextZoom()
        if (nextZoom === null) {
          return
        }

        if (nextZoom === currentZoom && panDelta) {
          const nextOffset = applyClampedOffset(
            currentZoom,
            addPoints(currentOffset, panDelta),
          )
          context.set("offset", nextOffset)
          return
        }

        if (nextZoom === currentZoom) {
          return
        }

        const {x: centerX, y: centerY} = getViewportCenter(viewportRect)

        const zoomRatio = nextZoom / currentZoom
        let nextOffset: Point = {
          x:
            (1 - zoomRatio) * (point.x - centerX) + zoomRatio * currentOffset.x,
          y:
            (1 - zoomRatio) * (point.y - centerY) + zoomRatio * currentOffset.y,
        }

        nextOffset = applyClampedOffset(
          nextZoom,
          panDelta ? addPoints(nextOffset, panDelta) : nextOffset,
        )

        context.set("zoom", nextZoom)
        context.set("offset", nextOffset)
      },
    },
    guards: {
      canPan({computed, context}) {
        return (
          context.get("open") &&
          computed("isImageReady") &&
          computed("isMeasured")
        )
      },
      hasViewportRect({computed, context}) {
        return (
          context.get("open") &&
          computed("isImageReady") &&
          computed("isMeasured")
        )
      },
    },
  })
