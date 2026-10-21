// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  ImageViewerContext,
  type ImageViewerContextProps,
} from "./image-viewer-context.js"
import {
  ImageViewerTrigger,
  type ImageViewerTriggerProps,
  ImageViewerBackdrop,
  type ImageViewerBackdropProps,
  ImageViewerPositioner,
  type ImageViewerPositionerProps,
  ImageViewerContent,
  type ImageViewerContentProps,
  ImageViewerCloseButton,
  type ImageViewerCloseButtonProps,
  ImageViewerFloatingPortal,
  type ImageViewerFloatingPortalProps,
} from "./image-viewer-popup.js"
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
  ImageViewerStaticImage,
  type ImageViewerStaticImageProps,
} from "./image-viewer-static-image.js"
import {
  ImageViewerViewportImage,
  type ImageViewerViewportImageProps,
} from "./image-viewer-viewport-image.js"
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
import {ImageViewer as SimpleImageViewer} from "./image-viewer.js"

export * from "./qds-image-viewer-context.js"

export type {ImageViewerProps} from "./image-viewer.js"

export type {
  ImageViewerStaticImageProps,
  ImageViewerTriggerProps,
  ImageViewerBackdropProps,
  ImageViewerPositionerProps,
  ImageViewerContentProps,
  ImageViewerCloseButtonProps,
  ImageViewerFloatingPortalProps,
  ImageViewerRootProps,
  ImageViewerRootProviderProps,
  ImageViewerViewportProps,
  ImageViewerViewportImageProps,
  ImageViewerContextProps,
  ImageViewerZoomInButtonProps,
  ImageViewerZoomOutButtonProps,
  ImageViewerResetButtonProps,
}

type ImageViewerComponent = typeof SimpleImageViewer & {
  Backdrop: typeof ImageViewerBackdrop
  CloseButton: typeof ImageViewerCloseButton
  Content: typeof ImageViewerContent
  Context: typeof ImageViewerContext
  FloatingPortal: typeof ImageViewerFloatingPortal
  Positioner: typeof ImageViewerPositioner
  ResetButton: typeof ImageViewerResetButton
  Root: typeof ImageViewerRoot
  RootProvider: typeof ImageViewerRootProvider
  StaticImage: typeof ImageViewerStaticImage
  Trigger: typeof ImageViewerTrigger
  Viewport: typeof ImageViewerViewport
  ViewportImage: typeof ImageViewerViewportImage
  ZoomInButton: typeof ImageViewerZoomInButton
  ZoomOutButton: typeof ImageViewerZoomOutButton
}

/**
 * @since next-release
 */
export const ImageViewer: ImageViewerComponent =
  SimpleImageViewer as ImageViewerComponent

ImageViewer.Backdrop = ImageViewerBackdrop
ImageViewer.CloseButton = ImageViewerCloseButton
ImageViewer.Content = ImageViewerContent
ImageViewer.Context = ImageViewerContext
ImageViewer.FloatingPortal = ImageViewerFloatingPortal
ImageViewer.Positioner = ImageViewerPositioner
ImageViewer.ResetButton = ImageViewerResetButton
ImageViewer.Root = ImageViewerRoot
ImageViewer.RootProvider = ImageViewerRootProvider
ImageViewer.StaticImage = ImageViewerStaticImage
ImageViewer.Trigger = ImageViewerTrigger
ImageViewer.Viewport = ImageViewerViewport
ImageViewer.ViewportImage = ImageViewerViewportImage
ImageViewer.ZoomInButton = ImageViewerZoomInButton
ImageViewer.ZoomOutButton = ImageViewerZoomOutButton
