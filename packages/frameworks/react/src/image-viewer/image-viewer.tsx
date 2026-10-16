// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {ButtonGroup, type ButtonGroupProps} from "@qualcomm-ui/react/button"

import {
  ImageViewerImage,
  type ImageViewerImageProps,
} from "./image-viewer-image.js"
import {
  ImageViewerResetButton,
  type ImageViewerResetButtonProps,
} from "./image-viewer-reset-button.js"
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

export interface ImageViewerProps extends ImageViewerRootProps {
  /**
   * Text describing the image.
   */
  alt: string

  /**
   * The simple ImageViewer owns its children. Use ImageViewer.Root for custom
   * composition.
   */
  children?: never

  /**
   * Whether to show the zoom and reset buttons.
   *
   * @default true
   */
  controls?: boolean

  /**
   * Props applied to the button group above the viewport.
   *
   * @inheritDoc
   */
  controlsProps?: ButtonGroupProps

  /**
   * Props applied to the image.
   *
   * @inheritDoc
   */
  imageProps?: Omit<ImageViewerImageProps, "src" | "alt">

  /**
   * Props applied to the reset button.
   *
   * @inheritDoc
   */
  resetButtonProps?: ImageViewerResetButtonProps

  /**
   * The image URL.
   */
  src: string

  /**
   * Props applied to the viewport. Use className or style to override its
   * dimensions.
   *
   * @inheritDoc
   */
  viewportProps?: ImageViewerViewportProps

  /**
   * Props applied to the zoom-in button.
   *
   * @inheritDoc
   */
  zoomInButtonProps?: ImageViewerZoomInButtonProps

  /**
   * Props applied to the zoom-out button.
   *
   * @inheritDoc
   */
  zoomOutButtonProps?: ImageViewerZoomOutButtonProps
}

/**
 * Displays an image with pan, zoom, and reset controls.
 */
export function ImageViewer({
  alt,
  controls = true,
  controlsProps,
  imageProps,
  resetButtonProps,
  src,
  viewportProps,
  zoomInButtonProps,
  zoomOutButtonProps,
  ...props
}: ImageViewerProps): ReactElement {
  return (
    <ImageViewerRoot {...props}>
      {controls ? (
        <ButtonGroup {...controlsProps}>
          <ImageViewerZoomOutButton {...zoomOutButtonProps} />
          <ImageViewerZoomInButton {...zoomInButtonProps} />
          <ImageViewerResetButton {...resetButtonProps} />
        </ButtonGroup>
      ) : null}
      <ImageViewerViewport {...viewportProps}>
        <ImageViewerImage {...imageProps} alt={alt} src={src} />
      </ImageViewerViewport>
    </ImageViewerRoot>
  )
}
