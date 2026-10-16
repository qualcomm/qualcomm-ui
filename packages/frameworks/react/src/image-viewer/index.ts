// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  ImageViewerContext,
  type ImageViewerContextProps,
} from "./image-viewer-context.js"
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
import {
  ImageViewer as SimpleImageViewer,
  type ImageViewerProps,
} from "./image-viewer.js"

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
  ImageViewerProps,
  ImageViewerRootProps,
  ImageViewerRootProviderProps,
  ImageViewerViewportProps,
  ImageViewerImageProps,
  ImageViewerContextProps,
  ImageViewerZoomInButtonProps,
  ImageViewerZoomOutButtonProps,
  ImageViewerResetButtonProps,
}

type ImageViewerComponent = typeof SimpleImageViewer & {
  Context: typeof ImageViewerContext
  Image: typeof ImageViewerImage
  ResetButton: typeof ImageViewerResetButton
  Root: typeof ImageViewerRoot
  RootProvider: typeof ImageViewerRootProvider
  Viewport: typeof ImageViewerViewport
  ZoomInButton: typeof ImageViewerZoomInButton
  ZoomOutButton: typeof ImageViewerZoomOutButton
}

const ImageViewer = SimpleImageViewer as ImageViewerComponent

ImageViewer.Root = ImageViewerRoot
ImageViewer.RootProvider = ImageViewerRootProvider
ImageViewer.Viewport = ImageViewerViewport
ImageViewer.Image = ImageViewerImage
ImageViewer.Context = ImageViewerContext
ImageViewer.ZoomInButton = ImageViewerZoomInButton
ImageViewer.ZoomOutButton = ImageViewerZoomOutButton
ImageViewer.ResetButton = ImageViewerResetButton

export {ImageViewer}

export * from "./qds-image-viewer-context.js"
