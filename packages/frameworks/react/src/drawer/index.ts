import {DrawerBackdrop, type DrawerBackdropProps} from "./drawer-backdrop"
import {DrawerBody, type DrawerBodyProps} from "./drawer-body"
import {
  DrawerCloseButton,
  type DrawerCloseButtonProps,
} from "./drawer-close-button"
import {
  DrawerCloseTrigger,
  type DrawerCloseTriggerProps,
} from "./drawer-close-trigger"
import {DrawerContent, type DrawerContentProps} from "./drawer-content"
import {DrawerContext, type DrawerContextProps} from "./drawer-context"
import {
  DrawerDescription,
  type DrawerDescriptionProps,
} from "./drawer-description"
import {
  DrawerFloatingPortal,
  type DrawerFloatingPortalProps,
} from "./drawer-floating-portal"
import {DrawerFooter, type DrawerFooterProps} from "./drawer-footer"
import {DrawerHeading, type DrawerHeadingProps} from "./drawer-heading"
import {
  DrawerIndicatorIcon,
  type DrawerIndicatorIconProps,
} from "./drawer-indicator-icon"
import {DrawerPositioner, type DrawerPositionerProps} from "./drawer-positioner"
import {DrawerRoot, type DrawerRootProps} from "./drawer-root"
import {DrawerTrigger, type DrawerTriggerProps} from "./drawer-trigger"

export * from "./qds-drawer-context"

export type {
  DrawerBackdropProps,
  DrawerBodyProps,
  DrawerCloseButtonProps,
  DrawerCloseTriggerProps,
  DrawerContentProps,
  DrawerContextProps,
  DrawerDescriptionProps,
  DrawerFloatingPortalProps,
  DrawerFooterProps,
  DrawerHeadingProps,
  DrawerIndicatorIconProps,
  DrawerPositionerProps,
  DrawerRootProps,
  DrawerTriggerProps,
}

type DrawerComponent = {
  /**
   * An overlay displayed beneath the drawer to prevent interaction with the rest of
   * the page. Renders a `<div>` element by default.
   */
  Backdrop: typeof DrawerBackdrop
  /**
   * The main content of the drawer. Container for the heading, description,
   * indicator, and primary content of the dialog. Renders a `<div>` element by
   * default.
   */
  Body: typeof DrawerBody
  /**
   * A button that closes the drawer. Renders a `<button>` element by default.
   */
  CloseButton: typeof DrawerCloseButton
  /**
   * A button that closes the drawer.  Doesn't render anything by itself. Uses a
   * render prop to spread its props onto the child element, which triggers the close
   * action on activation.
   *
   * @example
   * ```tsx
   * <Dialog.CloseTrigger>
   *   <button>Close Dialog</button>
   * </Dialog.CloseTrigger>
   * ```
   */
  CloseTrigger: typeof DrawerCloseTrigger
  /**
   * A container for the drawer contents. Renders a `<section>` element by default.
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
  Content: typeof DrawerContent
  Context: typeof DrawerContext
  /**
   * A description with additional information about the drawer. Renders a `<div>`
   * element by default.
   */
  Description: typeof DrawerDescription
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
  FloatingPortal: typeof DrawerFloatingPortal
  /**
   * Content that appears at the bottom of the drawer, typically reserved for
   * actions. Renders a `<div>` element by default.
   */
  Footer: typeof DrawerFooter
  Heading: typeof DrawerHeading
  /**
   * Renders an icon that indicates the drawer's status. Renders a `<span>` element
   * by default.
   */
  IndicatorIcon: typeof DrawerIndicatorIcon
  /**
   * A container that positions the drawer on the screen. Renders a `<div>` element
   * by default.
   */
  Positioner: typeof DrawerPositioner
  /**
   * Groups all parts of the drawer. Doesn't render its own HTML element.
   */
  Root: typeof DrawerRoot
  /**
   * A button that opens the drawer.  Doesn't render anything by itself. Uses a
   * render prop to spread its props onto the child element.
   *
   * @example
   * ```tsx
   * <Dialog.Trigger>
   *   <button>Open Dialog</button>
   * </Dialog.Trigger>
   * ```
   */
  Trigger: typeof DrawerTrigger
}

export const Drawer: DrawerComponent = {
  Backdrop: DrawerBackdrop,
  Body: DrawerBody,
  CloseButton: DrawerCloseButton,
  CloseTrigger: DrawerCloseTrigger,
  Content: DrawerContent,
  Context: DrawerContext,
  Description: DrawerDescription,
  FloatingPortal: DrawerFloatingPortal,
  Footer: DrawerFooter,
  Heading: DrawerHeading,
  IndicatorIcon: DrawerIndicatorIcon,
  Positioner: DrawerPositioner,
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
}
