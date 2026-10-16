// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Point, Size} from "@qualcomm-ui/dom/rect-utils"
import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {DirectionProperty} from "@qualcomm-ui/utils/direction"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {
  ActionSchema,
  CommonProperties,
  EffectSchema,
  GuardSchema,
  IdRegistrationProps,
  JSX,
  MachineSchema,
  ScopeWithIds,
} from "@qualcomm-ui/utils/machine"

import type {imageViewerAnatomy} from "./image-viewer.anatomy.js"

export interface BoundingRect {
  bottom: number
  height: number
  left: number
  right: number
  top: number
  width: number
}

export interface ZoomChangeDetails {
  zoom: number
}

export interface RotationChangeDetails {
  rotation: number
}

export interface FlipState {
  horizontal: boolean
  vertical: boolean
}

export interface FlipChangeDetails {
  flip: FlipState
}

export interface PreviewDescriptionDetails {
  rotation: number | null
  zoom: number | null
}

export interface IntlTranslations {
  previewDescription?:
    | ((details: PreviewDescriptionDetails) => string)
    | undefined
  previewLoading?: string | undefined
  resetLabel?: string | undefined
  rootLabel?: string | undefined
  rootRoleDescription?: string | undefined
  viewportInstructions?: string | undefined
  zoomInLabel?: string | undefined
  zoomOutLabel?: string | undefined
}

export interface ImageViewerElementIds {
  image: string
  root: string
  viewport: string
}

export interface ImageViewerApiProps
  extends DirectionProperty, CommonProperties {
  /**
   * The initial flip state to apply to the image.
   * @default { horizontal: false, vertical: false }
   */
  defaultFlip?: FlipState | undefined
  /**
   * The initial rotation to apply to the image in degrees.
   * @default 0
   */
  defaultRotation?: number | undefined
  /**
   * The initial zoom factor to apply to the image.
   * @default 1
   */
  defaultZoom?: number | undefined
  /**
   * The controlled flip state of the image.
   */
  flip?: FlipState | undefined
  /**
   * The ids of the image viewer elements
   */
  ids?: Partial<ImageViewerElementIds> | undefined
  /**
   * The maximum zoom factor allowed.
   * @default 5
   */
  maxZoom?: number | undefined
  /**
   * The minimum zoom factor allowed.
   * @default 1
   */
  minZoom?: number | undefined
  /**
   * The base nudge step for keyboard arrow keys (in pixels).
   * @default 1
   */
  nudgeStep?: number | undefined
  /**
   * The nudge step when Ctrl/Cmd key is held (in pixels).
   * @default 50
   */
  nudgeStepCtrl?: number | undefined
  /**
   * The nudge step when Shift key is held (in pixels).
   * @default 10
   */
  nudgeStepShift?: number | undefined
  /**
   * Callback fired when the flip state changes.
   */
  onFlipChange?: ((details: FlipChangeDetails) => void) | undefined
  /**
   * Callback fired when the rotation changes.
   */
  onRotationChange?: ((details: RotationChangeDetails) => void) | undefined
  /**
   * Callback fired when the zoom level changes.
   */
  onZoomChange?: ((details: ZoomChangeDetails) => void) | undefined
  /**
   * The controlled rotation of the image in degrees (0 - 360).
   */
  rotation?: number | undefined
  /**
   * Specifies the localized strings that identify accessibility elements and their
   * states.
   */
  translations?: IntlTranslations | undefined
  /**
   * The controlled zoom level of the image.
   */
  zoom?: number | undefined
  /**
   * Controls how responsive pinch-to-zoom is.
   * @default 2
   */
  zoomSensitivity?: number | undefined
  /**
   * The amount of zoom applied per wheel step.
   * @default 0.1
   */
  zoomStep?: number | undefined
}

type PropsWithDefault =
  | "defaultZoom"
  | "zoomStep"
  | "zoomSensitivity"
  | "minZoom"
  | "maxZoom"
  | "defaultRotation"
  | "defaultFlip"
  | "nudgeStep"
  | "nudgeStepShift"
  | "nudgeStepCtrl"

type Events =
  | {src?: "prop"; type: "SET_ZOOM"; zoom: number}
  | {rotation: number; type: "SET_ROTATION"}
  | {flip: Partial<FlipState>; type: "SET_FLIP"}
  | {point: Point; type: "PAN_POINTER_DOWN"}
  | {
      altKey: boolean
      point: Point
      shiftKey: boolean
      target: Element | null
      type: "POINTER_MOVE"
    }
  | {src?: "pinch"; type: "POINTER_UP"}
  | {touches: Point[]; type: "PINCH_START" | "PINCH_MOVE"}
  | {delta: number; trigger: "keyboard"; type: "ZOOM"}
  | {delta: number; point: Point; trigger: "wheel"; type: "ZOOM"}
  | {
      delta: number
      panDelta: Point
      point: Point
      scale: number
      trigger: "touch"
      type: "ZOOM"
    }
  | {
      ctrlKey: boolean
      key: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight"
      metaKey: boolean
      shiftKey: boolean
      src: "viewport"
      type: "NUDGE_PAN"
    }
  | {size: Size; src: "element" | "ssr"; type: "SET_NATURAL_SIZE"}
  | {src: "resize"; type: "VIEWPORT_RESIZE"}
  | {type: "PINCH_END" | "RESET"}

export interface ImageViewerSchema extends MachineSchema {
  actions: ActionSchema<
    | "checkImageStatus"
    | "setNaturalSize"
    | "setPointerStart"
    | "setOffsetStart"
    | "updatePanOffset"
    | "setRotation"
    | "setFlip"
    | "clearPointerStart"
    | "clearOffsetStart"
    | "updateZoom"
    | "setPinchDistance"
    | "handlePinchMove"
    | "clearPinchDistance"
    | "nudgePan"
    | "resizeViewport"
    | "resetToInitialState"
  >
  computed: {isImageReady: boolean; isMeasured: boolean}
  context: {
    flip: FlipState
    naturalSize: Size
    offset: Point
    offsetStart: Point | null
    pinchDistance: number | null
    pinchMidpoint: Point | null
    pointerStart: Point | null
    rotation: number
    viewportRect: BoundingRect
    zoom: number
  }
  effects: EffectSchema<
    | "trackPointerMove"
    | "trackViewportResize"
    | "trackWheelEvent"
    | "trackTouchEvents"
  >
  events: Events
  guards: GuardSchema<"hasViewportRect" | "canPan">
  ids: ImageViewerElementIds
  props: RequiredBy<ImageViewerApiProps, PropsWithDefault>
  state: "idle" | "panning"
}

export interface ImageViewerScope extends ScopeWithIds<ImageViewerSchema> {}

export interface ImageViewerApi {
  /**
   * The current flip state of the image.
   */
  flip: FlipState
  /**
   * Function to flip the image horizontally. Pass a boolean to set explicitly or
   * omit to toggle.
   */
  flipHorizontally: (value?: boolean) => void
  /**
   * Function to flip the image vertically. Pass a boolean to set explicitly or omit
   * to toggle.
   */
  flipVertically: (value?: boolean) => void
  /**
   * The natural (original) size of the image.
   */
  naturalSize: Size
  /**
   * The current offset (pan position) of the image.
   */
  offset: Point
  /**
   * Whether the image is currently being panned.
   */
  panning: boolean
  /**
   * Function to reset the viewer to its initial state.
   */
  reset: () => void
  /**
   * Function to rotate the image by a relative amount in degrees.
   * @example rotateBy(90) // Rotate 90 degrees clockwise
   * @example rotateBy(-90) // Rotate 90 degrees counter-clockwise
   */
  rotateBy: (degrees: number) => void
  /**
   * The current rotation of the image in degrees.
   */
  rotation: number
  /**
   * Function to set the flip state of the image.
   */
  setFlip: (flip: Partial<FlipState>) => void
  /**
   * Function to set the rotation of the image.
   */
  setRotation: (rotation: number) => void
  /**
   * Function to set the zoom level of the image.
   */
  setZoom: (zoom: number) => void
  /**
   * The viewport rectangle dimensions and position.
   */
  viewportRect: BoundingRect
  /**
   * The current zoom level of the image.
   */
  zoom: number
  /**
   * Function to zoom the image by a relative amount.
   * @example zoomBy(0.1) // Zoom in by 10%
   * @example zoomBy(-0.1) // Zoom out by 10%
   */
  zoomBy: (delta: number) => void
  // group: bindings
  getImageBindings(props: IdRegistrationProps): ImageViewerImageBindings
  getResetTriggerBindings(): ImageViewerResetTriggerBindings
  getRootBindings(props: IdRegistrationProps): ImageViewerRootBindings
  getViewportBindings(props: IdRegistrationProps): ImageViewerViewportBindings
  getZoomInTriggerBindings(): ImageViewerZoomInTriggerBindings
  getZoomOutTriggerBindings(): ImageViewerZoomOutTriggerBindings
}

type PartName = AnatomyPartName<typeof imageViewerAnatomy>
interface Part<P extends PartName>
  extends AnatomyPart<"imageViewer", P>, DirectionProperty {}

export interface ImageViewerRootBindings extends Part<"root"> {
  "aria-busy": "true" | undefined
  "aria-controls": string
  "aria-description": string
  "aria-label": string
  "aria-live": "polite"
  "aria-roledescription": string
  "data-panning": BooleanDataAttr
  "data-pinch": BooleanDataAttr
  id: string
  role: "group"
  style: JSX.CSSProperties
}

export interface ImageViewerViewportBindings extends Part<"viewport"> {
  "aria-description": string
  "aria-label": string
  "data-ownedby": string
  "data-panning": BooleanDataAttr
  id: string
  onKeyDown: JSX.KeyboardEventHandler<HTMLElement>
  onPointerDown: JSX.PointerEventHandler<HTMLElement>
  role: "group"
  style: JSX.CSSProperties
  tabIndex: 0
}

export interface ImageViewerImageBindings extends Part<"image"> {
  "data-flip-horizontal": BooleanDataAttr
  "data-flip-vertical": BooleanDataAttr
  "data-ownedby": string
  "data-ready": BooleanDataAttr
  draggable: false
  id: string
  onLoad: (event: JSX.SyntheticEvent<HTMLImageElement>) => void
  style: JSX.CSSProperties
}

interface ImageViewerTriggerBindings {
  "aria-label": string
  disabled: boolean
  onClick: JSX.MouseEventHandler<HTMLButtonElement>
  type: "button"
}

export interface ImageViewerZoomInTriggerBindings
  extends Part<"zoomInTrigger">, ImageViewerTriggerBindings {}

export interface ImageViewerZoomOutTriggerBindings
  extends Part<"zoomOutTrigger">, ImageViewerTriggerBindings {}

export interface ImageViewerResetTriggerBindings
  extends Part<"resetTrigger">, ImageViewerTriggerBindings {}
