// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {Minimize2} from "lucide-react"

import {
  CoreImageViewer,
  type CoreImageViewerBackdropProps,
  type CoreImageViewerContentProps,
  type CoreImageViewerPositionerProps,
  type CoreImageViewerTriggerProps,
} from "@qualcomm-ui/react-core/image-viewer"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {Portal, type PortalProps} from "@qualcomm-ui/react-core/portal"
import {IconButton, type IconButtonProps} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsImageViewerContext} from "./qds-image-viewer-context.js"

export interface ImageViewerTriggerProps extends CoreImageViewerTriggerProps {}

/** A static preview button that opens the image popup. */
export function ImageViewerTrigger(
  props: ImageViewerTriggerProps,
): ReactElement {
  const qds = useQdsImageViewerContext()
  return (
    <CoreImageViewer.Trigger {...mergeProps(qds.getTriggerBindings(), props)} />
  )
}

export interface ImageViewerCloseButtonProps extends Omit<
  IconButtonProps,
  "icon"
> {
  /**
   * Icon displayed in the close button.
   * @default Minimize2
   */
  icon?: LucideIconOrElement
}

/** Closes the popup and restores the initial transform. */
export function ImageViewerCloseButton({
  icon = Minimize2,
  render,
  ...props
}: ImageViewerCloseButtonProps): ReactElement {
  const qds = useQdsImageViewerContext()
  return (
    <CoreImageViewer.CloseTrigger
      render={
        <IconButton
          {...mergeProps(qds.getCloseTriggerBindings(), props)}
          emphasis="white-persistent"
          icon={icon}
          render={render}
          variant="outline"
        />
      }
    />
  )
}

export interface ImageViewerBackdropProps extends CoreImageViewerBackdropProps {}

/** Dims the page behind the expanded image. */
export function ImageViewerBackdrop(
  props: ImageViewerBackdropProps,
): ReactNode {
  const qds = useQdsImageViewerContext()
  return (
    <CoreImageViewer.Backdrop
      {...mergeProps(qds.getBackdropBindings(), props)}
    />
  )
}

export interface ImageViewerPositionerProps extends CoreImageViewerPositionerProps {}

/** Positions the popup inside the padded browser viewport. */
export function ImageViewerPositioner(
  props: ImageViewerPositionerProps,
): ReactNode {
  const qds = useQdsImageViewerContext()
  return (
    <CoreImageViewer.Positioner
      {...mergeProps(qds.getPositionerBindings(), props)}
    />
  )
}

export interface ImageViewerContentProps extends CoreImageViewerContentProps {}

/** Contains the image viewport and an optional row of controls. */
export function ImageViewerContent(props: ImageViewerContentProps): ReactNode {
  const qds = useQdsImageViewerContext()
  return (
    <CoreImageViewer.Content {...mergeProps(qds.getContentBindings(), props)} />
  )
}

export interface ImageViewerFloatingPortalProps extends PortalProps {
  /** Props applied to the backdrop. @inheritDoc */
  backdropProps?: ImageViewerBackdropProps
  /** Popup contents, including the viewport and controls. */
  children?: ReactNode
  /** Props applied to the content. @inheritDoc */
  contentProps?: ImageViewerContentProps
  /** Props applied to the positioner. @inheritDoc */
  positionerProps?: ImageViewerPositionerProps
}

/** Combines a portal, backdrop, positioner, and content for the image popup. */
export function ImageViewerFloatingPortal({
  backdropProps,
  children,
  contentProps,
  positionerProps,
  ...props
}: ImageViewerFloatingPortalProps): ReactElement {
  return (
    <Portal {...props}>
      <ImageViewerBackdrop {...backdropProps} />
      <ImageViewerPositioner {...positionerProps}>
        <ImageViewerContent {...contentProps}>{children}</ImageViewerContent>
      </ImageViewerPositioner>
    </Portal>
  )
}
