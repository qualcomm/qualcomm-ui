// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {imageViewerClasses} from "./image-viewer.classes.js"

type ImageViewerClasses = typeof imageViewerClasses

export interface QdsImageViewerControlOverlayBindings {
  className: ImageViewerClasses["controlOverlay"]
}

export interface QdsImageViewerRootBindings {
  className: ImageViewerClasses["root"]
}

export interface QdsImageViewerViewportBindings {
  className: ImageViewerClasses["viewport"]
}

export interface QdsImageViewerImageBindings {
  className: ImageViewerClasses["image"]
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
  getControlOverlayBindings(): QdsImageViewerControlOverlayBindings
  getImageBindings(): QdsImageViewerImageBindings
  getResetTriggerBindings(): QdsImageViewerResetTriggerBindings
  getRootBindings(): QdsImageViewerRootBindings
  getViewportBindings(): QdsImageViewerViewportBindings
  getZoomInTriggerBindings(): QdsImageViewerZoomInTriggerBindings
  getZoomOutTriggerBindings(): QdsImageViewerZoomOutTriggerBindings
}
