// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {imageViewerClasses} from "./image-viewer.classes.js"
import type {
  QdsImageViewerApi,
  QdsImageViewerRootBindings,
  QdsImageViewerViewportBindings,
  QdsImageViewerViewportImageBindings,
  QdsImageViewerZoomInTriggerBindings,
  QdsImageViewerZoomOutTriggerBindings,
  QdsImageViewerResetTriggerBindings,
} from "./image-viewer.types.js"

export function createQdsImageViewerApi(
  normalize: PropNormalizer,
): QdsImageViewerApi {
  return {
    getBackdropBindings() {
      return normalize.element({className: imageViewerClasses.backdrop})
    },
    getCloseTriggerBindings() {
      return normalize.element({className: imageViewerClasses.closeTrigger})
    },
    getContentBindings() {
      return normalize.element({className: imageViewerClasses.content})
    },
    getPositionerBindings() {
      return normalize.element({className: imageViewerClasses.positioner})
    },
    getResetTriggerBindings(): QdsImageViewerResetTriggerBindings {
      return normalize.element({className: imageViewerClasses.resetTrigger})
    },

    getRootBindings(): QdsImageViewerRootBindings {
      return normalize.element({className: imageViewerClasses.root})
    },
    getStaticImageBindings() {
      return normalize.element({className: imageViewerClasses.staticImage})
    },
    getTriggerBindings() {
      return normalize.element({className: imageViewerClasses.trigger})
    },
    getViewportBindings(): QdsImageViewerViewportBindings {
      return normalize.element({className: imageViewerClasses.viewport})
    },
    getViewportImageBindings(): QdsImageViewerViewportImageBindings {
      return normalize.element({className: imageViewerClasses.viewportImage})
    },
    getZoomInTriggerBindings(): QdsImageViewerZoomInTriggerBindings {
      return normalize.element({className: imageViewerClasses.zoomInTrigger})
    },
    getZoomOutTriggerBindings(): QdsImageViewerZoomOutTriggerBindings {
      return normalize.element({className: imageViewerClasses.zoomOutTrigger})
    },
  }
}
