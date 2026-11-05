// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {imageViewerClasses} from "./image-viewer.classes.js"

type ImageViewerClasses = typeof imageViewerClasses

export interface QdsImageViewerRootBindings {
  className: ImageViewerClasses["root"]
}

export interface QdsImageViewerViewportBindings {
  className: ImageViewerClasses["viewport"]
}

export interface QdsImageViewerViewportImageBindings {
  className: ImageViewerClasses["viewportImage"]
}

export interface QdsImageViewerStaticImageBindings {
  className: ImageViewerClasses["staticImage"]
}

export interface QdsImageViewerZoomInTriggerBindings {
  className: ImageViewerClasses["zoomInTrigger"]
}

export interface QdsImageViewerZoomOutTriggerBindings {
  className: ImageViewerClasses["zoomOutTrigger"]
}

export interface QdsImageViewerResetTriggerBindings {
  className: ImageViewerClasses["resetTrigger"]
}

export interface QdsImageViewerApi {
  getBackdropBindings(): QdsImageViewerBackdropBindings
  getCloseTriggerBindings(): QdsImageViewerCloseTriggerBindings
  getContentBindings(): QdsImageViewerContentBindings
  getPositionerBindings(): QdsImageViewerPositionerBindings
  getResetTriggerBindings(): QdsImageViewerResetTriggerBindings

  getRootBindings(): QdsImageViewerRootBindings
  getStaticImageBindings(): QdsImageViewerStaticImageBindings
  getTriggerBindings(): QdsImageViewerTriggerBindings
  getViewportBindings(): QdsImageViewerViewportBindings
  getViewportImageBindings(): QdsImageViewerViewportImageBindings
  getZoomInTriggerBindings(): QdsImageViewerZoomInTriggerBindings
  getZoomOutTriggerBindings(): QdsImageViewerZoomOutTriggerBindings
}

export interface QdsImageViewerTriggerBindings {
  className: ImageViewerClasses["trigger"]
}

export interface QdsImageViewerCloseTriggerBindings {
  className: ImageViewerClasses["closeTrigger"]
}

export interface QdsImageViewerBackdropBindings {
  className: ImageViewerClasses["backdrop"]
}

export interface QdsImageViewerPositionerBindings {
  className: ImageViewerClasses["positioner"]
}

export interface QdsImageViewerContentBindings {
  className: ImageViewerClasses["content"]
}
