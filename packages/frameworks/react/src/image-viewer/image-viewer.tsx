// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {ButtonGroup, type ButtonGroupProps} from "@qualcomm-ui/react/button"

import {
  ImageViewerCloseButton,
  type ImageViewerCloseButtonProps,
  ImageViewerFloatingPortal,
  type ImageViewerFloatingPortalProps,
  ImageViewerTrigger,
  type ImageViewerTriggerProps,
} from "./image-viewer-popup.js"
import {
  ImageViewerResetButton,
  type ImageViewerResetButtonProps,
} from "./image-viewer-reset-button.js"
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

export interface ImageViewerProps extends ImageViewerRootProps {
  /**
   * The simple ImageViewer doesn't support children.
   */
  children?: never

  /**
   * Props applied to the close button.
   *
   * @inheritDoc
   */
  closeButtonProps?: ImageViewerCloseButtonProps

  /**
   * Props applied to the button group containing the zoom and reset controls.
   *
   * @inheritDoc
   */
  controlsProps?: ButtonGroupProps

  /**
   * Props applied to the portal, backdrop, positioner, and popup content.
   *
   * @inheritDoc
   */
  floatingPortalProps?: ImageViewerFloatingPortalProps

  /**
   * Props applied to the reset button.
   *
   * @inheritDoc
   */
  resetButtonProps?: ImageViewerResetButtonProps

  /**
   * Props applied to the static preview image. Its src and alt default to the
   * root values.
   *
   * @inheritDoc
   */
  staticImageProps?: ImageViewerStaticImageProps

  /**
   * Props applied to the preview button that opens the popup.
   *
   * @inheritDoc
   */
  triggerProps?: ImageViewerTriggerProps

  /**
   * Props applied to the expanded image. Its src and alt default to the root
   * values.
   *
   * @inheritDoc
   */
  viewportImageProps?: ImageViewerViewportImageProps

  /**
   * Props applied to the pan and zoom viewport.
   *
   * @inheritDoc
   */
  viewportProps?: ImageViewerViewportProps

  /**
   * Props applied to the zoom in button.
   *
   * @inheritDoc
   */
  zoomInButtonProps?: ImageViewerZoomInButtonProps

  /**
   * Props applied to the zoom out button.
   *
   * @inheritDoc
   */
  zoomOutButtonProps?: ImageViewerZoomOutButtonProps
}

/**
 * Displays an image preview that opens a popup with zoom and reset controls.
 */
export function ImageViewer({
  closeButtonProps,
  controlsProps,
  floatingPortalProps,
  resetButtonProps,
  staticImageProps,
  triggerProps,
  viewportImageProps,
  viewportProps,
  zoomInButtonProps,
  zoomOutButtonProps,
  ...props
}: ImageViewerProps): ReactElement {
  return (
    <ImageViewerRoot {...props}>
      <ImageViewerTrigger {...triggerProps}>
        <ImageViewerStaticImage {...staticImageProps} />
      </ImageViewerTrigger>
      <ImageViewerFloatingPortal {...floatingPortalProps}>
        <ImageViewerCloseButton {...closeButtonProps} />
        <ImageViewerViewport {...viewportProps}>
          <ImageViewerViewportImage {...viewportImageProps} />
        </ImageViewerViewport>
        <ButtonGroup aria-label="Image controls" size="sm" {...controlsProps}>
          <ImageViewerZoomOutButton {...zoomOutButtonProps} />
          <ImageViewerZoomInButton {...zoomInButtonProps} />
          <ImageViewerResetButton {...resetButtonProps} />
        </ButtonGroup>
      </ImageViewerFloatingPortal>
    </ImageViewerRoot>
  )
}
