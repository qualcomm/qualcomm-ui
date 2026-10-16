// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {ZoomIn} from "lucide-react"

import {CoreImageViewer} from "@qualcomm-ui/react-core/image-viewer"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {IconButton, type IconButtonProps} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsImageViewerContext} from "./qds-image-viewer-context.js"

export interface ImageViewerZoomInButtonProps extends Omit<
  IconButtonProps,
  "icon"
> {
  /**
   * Icon displayed in the button.
   *
   * @default ZoomIn
   */
  icon?: LucideIconOrElement
}

/**
 * Increases the image zoom level.
 */
export function ImageViewerZoomInButton({
  icon = ZoomIn,
  render,
  ...props
}: ImageViewerZoomInButtonProps): ReactElement {
  const qdsContext = useQdsImageViewerContext()
  const mergedProps = mergeProps(qdsContext.getZoomInTriggerBindings(), props)
  return (
    <CoreImageViewer.ZoomInTrigger
      render={<IconButton {...mergedProps} icon={icon} render={render} />}
    />
  )
}
