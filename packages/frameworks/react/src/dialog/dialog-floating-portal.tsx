// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {Portal, type PortalProps} from "@qualcomm-ui/react-core/portal"

import {DialogBackdrop, type DialogBackdropProps} from "./dialog-backdrop"
import {DialogContent, type DialogContentProps} from "./dialog-content"
import {DialogPositioner, type DialogPositionerProps} from "./dialog-positioner"

export interface DialogFloatingPortalProps extends PortalProps {
  /**
   * Props applied to the backdrop element.
   *
   * @inheritDoc
   */
  backdropProps?: DialogBackdropProps

  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * Props applied to the content element.
   *
   * @inheritDoc
   */
  contentProps?: DialogContentProps

  /**
   * Props applied to the positioner element.
   *
   * @inheritDoc
   */
  positionerProps?: DialogPositionerProps
}

/**
 * A helper component that combines the portal, positioner, and content
 * components. This shortcut is equivalent to:
 * @example
 * ```tsx
 * <Portal {...props}>
 *   <Dialog.Backdrop {...backdropProps} />
 *   <Dialog.Positioner {...positionerProps}>
 *     <Dialog.Content {...contentProps}>{children}</Dialog.Content>
 *   </Dialog.Positioner>
 * </Portal>
 * ```
 */
export function DialogFloatingPortal({
  backdropProps,
  children,
  contentProps,
  positionerProps,
  ...props
}: DialogFloatingPortalProps): ReactElement {
  return (
    <Portal {...props}>
      <DialogBackdrop {...backdropProps} />
      <DialogPositioner {...positionerProps}>
        <DialogContent {...contentProps}>{children}</DialogContent>
      </DialogPositioner>
    </Portal>
  )
}
