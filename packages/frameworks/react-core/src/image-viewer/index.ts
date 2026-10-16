// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  CoreImageViewerRoot,
  type CoreImageViewerRootProps,
  CoreImageViewerRootProvider,
  type CoreImageViewerRootProviderProps,
  CoreImageViewerViewport,
  type CoreImageViewerViewportProps,
  CoreImageViewerImage,
  type CoreImageViewerImageProps,
  CoreImageViewerContext,
  type CoreImageViewerContextProps,
  CoreImageViewerZoomInTrigger,
  type CoreImageViewerZoomInTriggerProps,
  CoreImageViewerZoomOutTrigger,
  type CoreImageViewerZoomOutTriggerProps,
  CoreImageViewerResetTrigger,
  type CoreImageViewerResetTriggerProps,
} from "./core-image-viewer.js"

export * from "./image-viewer-context.js"

export * from "./use-image-viewer.js"

export type {
  CoreImageViewerRootProps,
  CoreImageViewerRootProviderProps,
  CoreImageViewerViewportProps,
  CoreImageViewerImageProps,
  CoreImageViewerContextProps,
  CoreImageViewerZoomInTriggerProps,
  CoreImageViewerZoomOutTriggerProps,
  CoreImageViewerResetTriggerProps,
}

interface CoreImageViewerComponent {
  Context: typeof CoreImageViewerContext
  Image: typeof CoreImageViewerImage
  ResetTrigger: typeof CoreImageViewerResetTrigger
  Root: typeof CoreImageViewerRoot
  RootProvider: typeof CoreImageViewerRootProvider
  Viewport: typeof CoreImageViewerViewport
  ZoomInTrigger: typeof CoreImageViewerZoomInTrigger
  ZoomOutTrigger: typeof CoreImageViewerZoomOutTrigger
}

export const CoreImageViewer: CoreImageViewerComponent = {
  Context: CoreImageViewerContext,
  Image: CoreImageViewerImage,
  ResetTrigger: CoreImageViewerResetTrigger,
  Root: CoreImageViewerRoot,
  RootProvider: CoreImageViewerRootProvider,
  Viewport: CoreImageViewerViewport,
  ZoomInTrigger: CoreImageViewerZoomInTrigger,
  ZoomOutTrigger: CoreImageViewerZoomOutTrigger,
}
