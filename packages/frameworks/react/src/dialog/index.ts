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

export * from "./qds-dialog-context"

export type {
  DialogBackdropProps,
  DialogBodyProps,
  DialogCloseButtonProps,
  DialogCloseTriggerProps,
  DialogContentProps,
  DialogContextProps,
  DialogDescriptionProps,
  DialogFloatingPortalProps,
  DialogFooterProps,
  DialogHeadingProps,
  DialogIndicatorIconProps,
  DialogPositionerProps,
  DialogRootProps,
  DialogTriggerProps,
}

type DialogComponent = {
  /**
   * An overlay displayed beneath the dialog to prevent interaction with the rest of
   * the page. Renders a `<div>` element by default.
   */
  Backdrop: typeof DialogBackdrop
  /**
   * The main content of the dialog. Container for the heading, description,
   * indicator, and primary content of the dialog. Renders a `<div>` element by
   * default.
   */
  Body: typeof DialogBody
  /**
   * A button that closes the dialog. Renders a `<button>` element by default.
   */
  CloseButton: typeof DialogCloseButton
  /**
   * A button that closes the dialog.  Doesn't render anything by itself. Uses a
   * render prop to spread its props onto the child element.
   *
   * @example
   * ```tsx
   * <Dialog.CloseTrigger>
   *   <button>Close Dialog</button>
   * </Dialog.CloseTrigger>
   * ```
   */
  CloseTrigger: typeof DialogCloseTrigger
  /**
   * A container for the dialog contents. Renders a `<section>` element by default.
   *
   * @example
   * ```tsx
   * <Dialog.Root>
   *   <Dialog.Positioner>
   *     <Dialog.Content></Dialog.Content>
   *   </Dialog.Positioner>
   * </Dialog.Root>
   * ```
   */
  Content: typeof DialogContent
  Context: typeof DialogContext
  /**
   * A description with additional information about the dialog. Renders a `<div>`
   * element by default.
   */
  Description: typeof DialogDescription
  /**
   * A helper component that combines the floating element positioner and content
   * wrappers. This shortcut is equivalent to:
   * @example
   * ```tsx
   * <Portal {...props}>
   *   <DialogBackdrop {...backdropProps} />
   *   <DialogPositioner {...positionerProps}>
   *     <DialogContent {...contentProps}>{children}</DialogContent>
   *   </DialogPositioner>
   * </Portal>
   * ```
   */
  FloatingPortal: typeof DialogFloatingPortal
  /**
   * Content that appears at the bottom of the dialog, typically reserved for
   * actions. Renders a `<div>` element by default.
   */
  Footer: typeof DialogFooter
  /**
   * A heading that labels the dialog. Renders an `<h2>` element by default.
   *
   * @example
   * ```tsx
   * <Dialog.Content>
   *   <Dialog.Body>
   *     <Dialog.Heading>Title...</Dialog.Heading>
   *     // ... other
   *   </Dialog.Body>
   * </Dialog.Content>
   * ```
   */
  Heading: typeof DialogHeading
  /**
   * An icon that indicates the dialog's status. Renders a `<span>` element by
   * default.
   */
  IndicatorIcon: typeof DialogIndicatorIcon
  /**
   * A container that positions the dialog on the screen. Renders a `<div>` element
   * by default.
   */
  Positioner: typeof DialogPositioner
  /**
   * Groups all parts of the dialog. Doesn't render its own HTML element.
   */
  Root: typeof DialogRoot
  /**
   * Enhances a child element to open the dialog when clicked. Requires a single
   * child element.
   *
   * @example
   * ```tsx
   * <Dialog.Trigger>
   *   <button>Open Dialog</button>
   * </Dialog.Trigger>
   * ```
   */
  Trigger: typeof DialogTrigger
}

export const Dialog: DialogComponent = {
  Backdrop: DialogBackdrop,
  Body: DialogBody,
  CloseButton: DialogCloseButton,
  CloseTrigger: DialogCloseTrigger,
  Content: DialogContent,
  Context: DialogContext,
  Description: DialogDescription,
  FloatingPortal: DialogFloatingPortal,
  Footer: DialogFooter,
  Heading: DialogHeading,
  IndicatorIcon: DialogIndicatorIcon,
  Positioner: DialogPositioner,
  Root: DialogRoot,
  Trigger: DialogTrigger,
}
