// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  ImageViewerContext,
  type ImageViewerContextProps,
} from "./image-viewer-context.js"
import {
  ImageViewerControlOverlay,
  type ImageViewerControlOverlayProps,
} from "./image-viewer-control-overlay.js"
import {
  ImageViewerImage,
  type ImageViewerImageProps,
} from "./image-viewer-image.js"
import {
  ImageViewerResetButton,
  type ImageViewerResetButtonProps,
} from "./image-viewer-reset-button.js"
import {
  ImageViewerRootProvider,
  type ImageViewerRootProviderProps,
} from "./image-viewer-root-provider.js"
import {
  ImageViewerRoot,
  type ImageViewerRootProps,
} from "./image-viewer-root.js"
import {
  ImageViewerViewport,
  type ImageViewerViewportProps,
} from "./image-viewer-viewport.js"
import {
  ImageViewerZoomInButton,
  type ImageViewerZoomInButtonProps,
} from "./image-viewer-zoom-in-button.js"
import {
  ImageViewerZoomOutButton,
  type ImageViewerZoomOutButtonProps,
} from "./image-viewer-zoom-out-button.js"

export {
  useImageViewer,
  useImageViewerContext,
} from "@qualcomm-ui/react-core/image-viewer"

export type {
  ImageViewerApi,
  ImageViewerApiProps,
  FlipState,
  FlipChangeDetails,
  RotationChangeDetails,
  ZoomChangeDetails,
} from "@qualcomm-ui/core/image-viewer"

export type {
  ImageViewerControlOverlayProps,
  ImageViewerRootProps,
  ImageViewerRootProviderProps,
  ImageViewerViewportProps,
  ImageViewerImageProps,
  ImageViewerContextProps,
  ImageViewerZoomInButtonProps,
  ImageViewerZoomOutButtonProps,
  ImageViewerResetButtonProps,
}

interface ImageViewerComponent {
  Context: typeof ImageViewerContext
  ControlOverlay: typeof ImageViewerControlOverlay
  Image: typeof ImageViewerImage
  ResetButton: typeof ImageViewerResetButton
  Root: typeof ImageViewerRoot
  RootProvider: typeof ImageViewerRootProvider
  Viewport: typeof ImageViewerViewport
  ZoomInButton: typeof ImageViewerZoomInButton
  ZoomOutButton: typeof ImageViewerZoomOutButton
}

export const ImageViewer: ImageViewerComponent = {
  Context: ImageViewerContext,
  ControlOverlay: ImageViewerControlOverlay,
  Image: ImageViewerImage,
  ResetButton: ImageViewerResetButton,
  Root: ImageViewerRoot,
  RootProvider: ImageViewerRootProvider,
  Viewport: ImageViewerViewport,
  ZoomInButton: ImageViewerZoomInButton,
  ZoomOutButton: ImageViewerZoomOutButton,
}

export * from "./qds-image-viewer-context.js"
