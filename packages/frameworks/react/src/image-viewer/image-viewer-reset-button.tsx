// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {RefreshCw} from "lucide-react"

import {CoreImageViewer} from "@qualcomm-ui/react-core/image-viewer"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {IconButton, type IconButtonProps} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsImageViewerContext} from "./qds-image-viewer-context.js"

export interface ImageViewerResetButtonProps extends Omit<
  IconButtonProps,
  "icon"
> {
  /**
   * Icon displayed in the button.
   *
   * @default RefreshCw
   */
  icon?: LucideIconOrElement
}

/**
 * Restores the initial image transforms.
 */
export function ImageViewerResetButton({
  icon = RefreshCw,
  render,
  ...props
}: ImageViewerResetButtonProps): ReactElement {
  const qdsContext = useQdsImageViewerContext()
  const mergedProps = mergeProps(qdsContext.getResetTriggerBindings(), props)
  return (
    <CoreImageViewer.ResetTrigger
      render={<IconButton {...mergedProps} icon={icon} render={render} />}
    />
  )
}
