// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {imageViewerClasses} from "./image-viewer.classes.js"
import type {
  QdsImageViewerApi,
  QdsImageViewerRootBindings,
  QdsImageViewerViewportBindings,
  QdsImageViewerImageBindings,
  QdsImageViewerZoomInTriggerBindings,
  QdsImageViewerZoomOutTriggerBindings,
  QdsImageViewerResetTriggerBindings,
} from "./image-viewer.types.js"

export function createQdsImageViewerApi(
  normalize: PropNormalizer,
): QdsImageViewerApi {
  return {
    getImageBindings(): QdsImageViewerImageBindings {
      return normalize.element({className: imageViewerClasses.image})
    },
    getResetTriggerBindings(): QdsImageViewerResetTriggerBindings {
      return normalize.element({className: imageViewerClasses.resetTrigger})
    },
    getRootBindings(): QdsImageViewerRootBindings {
      return normalize.element({className: imageViewerClasses.root})
    },
    getViewportBindings(): QdsImageViewerViewportBindings {
      return normalize.element({className: imageViewerClasses.viewport})
    },
    getZoomInTriggerBindings(): QdsImageViewerZoomInTriggerBindings {
      return normalize.element({className: imageViewerClasses.zoomInTrigger})
    },
    getZoomOutTriggerBindings(): QdsImageViewerZoomOutTriggerBindings {
      return normalize.element({className: imageViewerClasses.zoomOutTrigger})
    },
  }
}
