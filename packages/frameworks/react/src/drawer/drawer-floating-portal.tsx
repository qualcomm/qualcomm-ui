// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {Portal, type PortalProps} from "@qualcomm-ui/react-core/portal"

import {DrawerBackdrop, type DrawerBackdropProps} from "./drawer-backdrop"
import {DrawerContent, type DrawerContentProps} from "./drawer-content"
import {DrawerPositioner, type DrawerPositionerProps} from "./drawer-positioner"

export interface DrawerFloatingPortalProps extends PortalProps {
  /**
   * Props applied to the backdrop element.
   *
   * @inheritDoc
   */
  backdropProps?: DrawerBackdropProps

  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * Props applied to the content element.
   *
   * @inheritDoc
   */
  contentProps?: DrawerContentProps

  /**
   * Props applied to the positioner element.
   *
   * @inheritDoc
   */
  positionerProps?: DrawerPositionerProps
}

/**
 * A helper component that combines the portal, positioner, and content
 * components. This shortcut is equivalent to:
 * @example
 * ```tsx
 * <Portal {...props}>
 *   <DrawerBackdrop {...backdropProps} />
 *   <DrawerPositioner {...positionerProps}>
 *     <DrawerContent {...contentProps}>{children}</DrawerContent>
 *   </DrawerPositioner>
 * </Portal>
 * ```
 */
export function DrawerFloatingPortal({
  backdropProps,
  children,
  contentProps,
  positionerProps,
  ...props
}: DrawerFloatingPortalProps): ReactElement {
  return (
    <Portal {...props}>
      <DrawerBackdrop {...backdropProps} />
      <DrawerPositioner {...positionerProps}>
        <DrawerContent {...contentProps}>{children}</DrawerContent>
      </DrawerPositioner>
    </Portal>
  )
}
