import type {FunctionComponent} from "react"

import {Dialog as SimpleDialog} from "./dialog"
import {DialogBackdrop, type DialogBackdropProps} from "./dialog-backdrop"
import {DialogBody, type DialogBodyProps} from "./dialog-body"
import {
  DialogCloseButton,
  type DialogCloseButtonProps,
} from "./dialog-close-button"
import {
  DialogCloseTrigger,
  type DialogCloseTriggerProps,
} from "./dialog-close-trigger"
import {DialogContent, type DialogContentProps} from "./dialog-content"
import {DialogContext, type DialogContextProps} from "./dialog-context"
import {
  DialogDescription,
  type DialogDescriptionProps,
} from "./dialog-description"
import {
  DialogFloatingPortal,
  type DialogFloatingPortalProps,
} from "./dialog-floating-portal"
import {DialogFooter, type DialogFooterProps} from "./dialog-footer"
import {DialogHeading, type DialogHeadingProps} from "./dialog-heading"
import {
  DialogIndicatorIcon,
  type DialogIndicatorIconProps,
} from "./dialog-indicator-icon"
import {DialogPositioner, type DialogPositionerProps} from "./dialog-positioner"
import {DialogRoot, type DialogRootProps} from "./dialog-root"
import {DialogTrigger, type DialogTriggerProps} from "./dialog-trigger"

export type {
  DialogCloseButtonProps,
  DialogHeadingProps,
  DialogContentProps,
  DialogRootProps,
  DialogTriggerProps,
  DialogIndicatorIconProps,
  DialogBodyProps,
  DialogContextProps,
  DialogBackdropProps,
  DialogPositionerProps,
  DialogFloatingPortalProps,
  DialogCloseTriggerProps,
  DialogFooterProps,
  DialogDescriptionProps,
}

type DialogComponent = typeof SimpleDialog & {
  /**
   * An overlay displayed beneath the dialog to prevent interaction with the rest
   * of the page. Renders a `<div>` element by default.
   */
  Backdrop: FunctionComponent<DialogBackdropProps>
  /**
   * The main content of the dialog. Container for the heading, description,
   * indicator icon, and primary content of the dialog. Renders a `<div>` element
   * by default.
   */
  Body: FunctionComponent<DialogBodyProps>
  /**
   * A button that closes the dialog. Renders a `<button>` element by default.
   */
  CloseButton: FunctionComponent<DialogCloseButtonProps>
  /**
   * A button that closes the dialog. Doesn't render anything by itself. Uses a
   * render prop to spread its props onto the child element.
   *
   * @example
   * ```tsx
   * <Dialog.CloseTrigger>
   *   <button>Close Dialog</button>
   * </Dialog.CloseTrigger>
   * ```
   */
  CloseTrigger: FunctionComponent<DialogCloseTriggerProps>
  /**
   * A container for the dialog contents. Renders a `<section>` element by
   * default.
   *
   * @example
   * ```tsx
   * <Dialog.Root>
   *   <Dialog.Positioner>
   *     <Dialog.Content />
   *   </Dialog.Positioner>
   * </Dialog.Root>
   * ```
   */
  Content: FunctionComponent<DialogContentProps>
  Context: FunctionComponent<DialogContextProps>
  /**
   * A description with additional information about the dialog. Renders a
   * `<div>` element by default.
   */
  Description: FunctionComponent<DialogDescriptionProps>
  /**
   * A helper component that combines the portal, backdrop, positioner, and
   * content components. This shortcut is equivalent to:
   *
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
  FloatingPortal: FunctionComponent<DialogFloatingPortalProps>
  /**
   * Content that appears at the bottom of the dialog, typically reserved for
   * actions. Renders a `<div>` element by default.
   */
  Footer: FunctionComponent<DialogFooterProps>
  /**
   * A heading that labels the dialog. Renders an `<h2>` element by default.
   *
   * @example
   * ```tsx
   * <Dialog.Content>
   *   <Dialog.Heading>Title...</Dialog.Heading>
   * </Dialog.Content>
   * ```
   */
  Heading: FunctionComponent<DialogHeadingProps>
  /**
   * An icon that indicates the dialog's status. Renders a `<div>` element by
   * default.
   */
  IndicatorIcon: FunctionComponent<DialogIndicatorIconProps>
  /**
   * A container that positions the dialog on the screen. Renders a `<div>`
   * element by default.
   */
  Positioner: FunctionComponent<DialogPositionerProps>
  /**
   * Groups all parts of the dialog. Doesn't render its own HTML element.
   */
  Root: FunctionComponent<DialogRootProps>
  Trigger: FunctionComponent<DialogTriggerProps>
}

export const Dialog: DialogComponent = SimpleDialog as DialogComponent

Dialog.CloseButton = DialogCloseButton
Dialog.Heading = DialogHeading
Dialog.Content = DialogContent
Dialog.Root = DialogRoot
Dialog.Trigger = DialogTrigger
Dialog.IndicatorIcon = DialogIndicatorIcon
Dialog.Body = DialogBody
Dialog.Context = DialogContext
Dialog.Backdrop = DialogBackdrop
Dialog.Positioner = DialogPositioner
Dialog.FloatingPortal = DialogFloatingPortal
Dialog.CloseTrigger = DialogCloseTrigger
Dialog.Footer = DialogFooter
Dialog.Description = DialogDescription
