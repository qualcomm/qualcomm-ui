// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  contains,
  getEventKey,
  getEventPoint,
  getEventTarget,
} from "@qualcomm-ui/dom/query"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Machine, PropNormalizer} from "@qualcomm-ui/utils/machine"
import {toPx} from "@qualcomm-ui/utils/number"
import {compact} from "@qualcomm-ui/utils/object"

import {imageViewerAnatomy} from "./image-viewer.anatomy.js"
import {domEls, domIds} from "./image-viewer.dom.js"
import type {
  ImageViewerApi,
  ImageViewerSchema,
  IntlTranslations,
  ImageViewerRootBindings,
  ImageViewerViewportBindings,
  ImageViewerImageBindings,
  ImageViewerZoomInTriggerBindings,
  ImageViewerZoomOutTriggerBindings,
  ImageViewerResetTriggerBindings,
} from "./image-viewer.types.js"
import {isEqualFlip, normalizeFlipState} from "./utils/crop.js"
import {getImageTransformCss} from "./utils/transform.js"

const defaultTranslations: Required<IntlTranslations> = {
  previewDescription({rotation, zoom}) {
    const zoomText =
      zoom != null && Number.isFinite(zoom)
        ? `${zoom.toFixed(2)}x zoom`
        : "default zoom"
    const rotationText =
      rotation != null && Number.isFinite(rotation)
        ? `${Math.round(rotation)} degrees rotation`
        : "0 degrees rotation"
    return `Image viewer preview, ${zoomText}, ${rotationText}.`
  },
  previewLoading: "Image viewer preview loading",
  resetLabel: "Reset image",
  rootLabel: "Image viewer",
  rootRoleDescription: "Image viewer",
  viewportInstructions:
    "Use arrow keys to pan the image. Press plus or minus to zoom.",
  zoomInLabel: "Zoom in",
  zoomOutLabel: "Zoom out",
}

export function createImageViewerApi(
  store: Machine<ImageViewerSchema>,
  normalize: PropNormalizer,
): ImageViewerApi {
  const {computed, context, prop, scope, send, state} = store
  const parts = imageViewerAnatomy.parts
  const panning = state.matches("panning")
  const translations = {
    ...defaultTranslations,
    ...compact(prop("translations")),
  }
  const zoom = context.get("zoom")
  const rotation = context.get("rotation")
  const flip = context.get("flip")
  const offset = context.get("offset")
  const naturalSize = context.get("naturalSize")
  const viewportRect = context.get("viewportRect")
  const isImageReady = computed("isImageReady")
  const isMeasured = computed("isMeasured")
  const ready = isImageReady && isMeasured

  const shouldIgnoreTouchPointer = (event: {
    isPrimary?: boolean
    pointerType?: string
  }) => {
    if (event.pointerType !== "touch") {
      return false
    }
    const isSecondaryTouch = event.isPrimary === false
    const pinchActive = context.get("pinchDistance") != null
    return isSecondaryTouch || pinchActive
  }

  return {
    flip,
    flipHorizontally(value) {
      const nextValue = typeof value === "boolean" ? value : !flip.horizontal
      if (nextValue === flip.horizontal) {
        return
      }
      send({flip: {horizontal: nextValue}, type: "SET_FLIP"})
    },
    flipVertically(value) {
      const nextValue = typeof value === "boolean" ? value : !flip.vertical
      if (nextValue === flip.vertical) {
        return
      }
      send({flip: {vertical: nextValue}, type: "SET_FLIP"})
    },
    naturalSize,
    offset,
    panning,
    reset() {
      send({type: "RESET"})
    },
    rotateBy(degrees) {
      send({rotation: rotation + degrees, type: "SET_ROTATION"})
    },
    rotation,
    setFlip(nextFlip) {
      if (!nextFlip) {
        return
      }
      const normalized = normalizeFlipState(nextFlip, flip)
      if (isEqualFlip(normalized, flip)) {
        return
      }
      send({flip: normalized, type: "SET_FLIP"})
    },
    setRotation(value) {
      send({rotation: value, type: "SET_ROTATION"})
    },
    setZoom(value) {
      send({type: "SET_ZOOM", zoom: value})
    },
    viewportRect,
    zoom,
    zoomBy(delta) {
      send({type: "SET_ZOOM", zoom: zoom + delta})
    },

    // group: bindings
    getImageBindings(props): ImageViewerImageBindings {
      scope.ids.register("image", props)
      const flipHorizontal = flip.horizontal
      const flipVertical = flip.vertical
      const transform = getImageTransformCss({flip, offset, rotation, zoom})
      return normalize.img({
        ...parts.image,
        "data-flip-horizontal": booleanDataAttr(flipHorizontal),
        "data-flip-vertical": booleanDataAttr(flipVertical),
        "data-ownedby": domIds.viewport(scope),
        "data-ready": booleanDataAttr(isImageReady),
        draggable: false,
        id: props.id,
        onLoad(event) {
          const imageEl = event.currentTarget
          if (!imageEl?.complete) {
            return
          }
          const {naturalHeight: height, naturalWidth: width} = imageEl
          send({
            size: {height, width},
            src: "element",
            type: "SET_NATURAL_SIZE",
          })
        },
        style: {
          objectFit: "fill",
          pointerEvents: "none",
          transform,
          transformOrigin: "center center",
          userSelect: "none",
          willChange: "transform",
        },
      })
    },
    getResetTriggerBindings(): ImageViewerResetTriggerBindings {
      return normalize.button({
        ...parts.resetTrigger,
        "aria-label": translations.resetLabel,
        dir: prop("dir"),
        disabled: !ready,
        onClick() {
          send({type: "RESET"})
        },
        type: "button",
      })
    },
    getRootBindings(props): ImageViewerRootBindings {
      scope.ids.register("root", props)
      return normalize.element({
        ...parts.root,
        "aria-busy": isImageReady ? undefined : "true",
        "aria-controls": domIds.viewport(scope),
        "aria-description": isImageReady
          ? translations.previewDescription({
              rotation: Number.isFinite(rotation) ? rotation : null,
              zoom: Number.isFinite(zoom) ? zoom : null,
            })
          : translations.previewLoading,
        "aria-label": translations.rootLabel,
        "aria-live": "polite",
        "aria-roledescription": translations.rootRoleDescription,
        "data-panning": booleanDataAttr(panning),
        "data-pinch": booleanDataAttr(context.get("pinchDistance") != null),
        dir: prop("dir"),
        id: props.id,
        role: "group",
        style: {
          "--image-offset-x": toPx(offset.x),
          "--image-offset-y": toPx(offset.y),
          "--image-rotation": rotation,
          "--image-zoom": zoom,
        },
      })
    },
    getViewportBindings(props): ImageViewerViewportBindings {
      scope.ids.register("viewport", props)
      return normalize.element({
        ...parts.viewport,
        "aria-description": translations.viewportInstructions,
        "aria-label": translations.rootLabel,
        "data-ownedby": domIds.root(scope),
        "data-panning": booleanDataAttr(panning),
        id: props.id,
        onKeyDown(event) {
          if (event.defaultPrevented) {
            return
          }
          const src = "viewport"
          const {altKey, ctrlKey, metaKey, shiftKey} = event
          const key = getEventKey(event, {dir: prop("dir")})
          const isZoomInKey = key === "+" || key === "="
          const isZoomOutKey = key === "-" || key === "_"
          if (isZoomInKey || isZoomOutKey) {
            const delta = isZoomInKey ? -1 : 1
            send({delta, trigger: "keyboard", type: "ZOOM"})
            event.preventDefault()
            return
          }
          const isArrowKey =
            key === "ArrowUp" ||
            key === "ArrowDown" ||
            key === "ArrowLeft" ||
            key === "ArrowRight"
          if (!isArrowKey || altKey) {
            return
          }
          send({ctrlKey, key, metaKey, shiftKey, src, type: "NUDGE_PAN"})
          event.preventDefault()
        },
        onPointerDown(event) {
          if (event.pointerType === "mouse" && event.button !== 0) {
            return
          }
          if (shouldIgnoreTouchPointer(event)) {
            return
          }
          const target = getEventTarget<HTMLElement>(event)
          const rootEl = domEls.root(scope)
          if (!target || !rootEl || !contains(rootEl, target)) {
            return
          }
          const point = getEventPoint(event)
          send({point, type: "PAN_POINTER_DOWN"})
        },
        role: "group",
        style: {
          overflow: "hidden",
          position: "relative",
          touchAction: "none",
          userSelect: "none",
        },
        tabIndex: 0,
      })
    },
    getZoomInTriggerBindings(): ImageViewerZoomInTriggerBindings {
      return normalize.button({
        ...parts.zoomInTrigger,
        "aria-label": translations.zoomInLabel,
        dir: prop("dir"),
        disabled: !ready || zoom >= prop("maxZoom"),
        onClick() {
          send({type: "SET_ZOOM", zoom: zoom + Math.abs(prop("zoomStep"))})
        },
        type: "button",
      })
    },
    getZoomOutTriggerBindings(): ImageViewerZoomOutTriggerBindings {
      return normalize.button({
        ...parts.zoomOutTrigger,
        "aria-label": translations.zoomOutLabel,
        dir: prop("dir"),
        disabled: !ready || zoom <= prop("minZoom"),
        onClick() {
          send({type: "SET_ZOOM", zoom: zoom - Math.abs(prop("zoomStep"))})
        },
        type: "button",
      })
    },
  }
}
