import {
  CoreImageViewerTrigger,
  type CoreImageViewerTriggerProps,
  CoreImageViewerCloseTrigger,
  type CoreImageViewerCloseTriggerProps,
  CoreImageViewerBackdrop,
  type CoreImageViewerBackdropProps,
  CoreImageViewerPositioner,
  type CoreImageViewerPositionerProps,
  CoreImageViewerContent,
  type CoreImageViewerContentProps,
} from "./core-image-viewer-popup.js"
import {
  CoreImageViewerStaticImage,
  type CoreImageViewerStaticImageProps,
} from "./core-image-viewer-static-image.js"
import {
  CoreImageViewerViewportImage,
  type CoreImageViewerViewportImageProps,
} from "./core-image-viewer-viewport-image.js"
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear
import {
  CoreImageViewerRoot,
  type CoreImageViewerRootProps,
  CoreImageViewerRootProvider,
  type CoreImageViewerRootProviderProps,
  CoreImageViewerViewport,
  type CoreImageViewerViewportProps,
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
  CoreImageViewerTriggerProps,
  CoreImageViewerCloseTriggerProps,
  CoreImageViewerBackdropProps,
  CoreImageViewerPositionerProps,
  CoreImageViewerContentProps,
  CoreImageViewerRootProps,
  CoreImageViewerRootProviderProps,
  CoreImageViewerViewportProps,
  CoreImageViewerStaticImageProps,
  CoreImageViewerViewportImageProps,
  CoreImageViewerContextProps,
  CoreImageViewerZoomInTriggerProps,
  CoreImageViewerZoomOutTriggerProps,
  CoreImageViewerResetTriggerProps,
}

interface CoreImageViewerComponent {
  Backdrop: typeof CoreImageViewerBackdrop
  CloseTrigger: typeof CoreImageViewerCloseTrigger
  Content: typeof CoreImageViewerContent
  Context: typeof CoreImageViewerContext
  Positioner: typeof CoreImageViewerPositioner
  ResetTrigger: typeof CoreImageViewerResetTrigger

  Root: typeof CoreImageViewerRoot
  RootProvider: typeof CoreImageViewerRootProvider
  StaticImage: typeof CoreImageViewerStaticImage
  Trigger: typeof CoreImageViewerTrigger
  Viewport: typeof CoreImageViewerViewport
  ViewportImage: typeof CoreImageViewerViewportImage
  ZoomInTrigger: typeof CoreImageViewerZoomInTrigger
  ZoomOutTrigger: typeof CoreImageViewerZoomOutTrigger
}

export const CoreImageViewer: CoreImageViewerComponent = {
  Backdrop: CoreImageViewerBackdrop,
  CloseTrigger: CoreImageViewerCloseTrigger,
  Content: CoreImageViewerContent,
  Context: CoreImageViewerContext,
  Positioner: CoreImageViewerPositioner,
  ResetTrigger: CoreImageViewerResetTrigger,

  Root: CoreImageViewerRoot,
  RootProvider: CoreImageViewerRootProvider,
  StaticImage: CoreImageViewerStaticImage,
  Trigger: CoreImageViewerTrigger,
  Viewport: CoreImageViewerViewport,
  ViewportImage: CoreImageViewerViewportImage,
  ZoomInTrigger: CoreImageViewerZoomInTrigger,
  ZoomOutTrigger: CoreImageViewerZoomOutTrigger,
}
