import {DialogBackdrop} from "./dialog-backdrop"
import {DialogBody} from "./dialog-body"
import {DialogCloseButton} from "./dialog-close-button"
import {DialogCloseTrigger} from "./dialog-close-trigger"
import {DialogContent} from "./dialog-content"
import {DialogDescription} from "./dialog-description"
import {DialogFloatingPortal} from "./dialog-floating-portal"
import {DialogFooter} from "./dialog-footer"
import {DialogHeading} from "./dialog-heading"
import {DialogIndicatorIcon} from "./dialog-indicator-icon"
import {DialogPositioner} from "./dialog-positioner"
import {DialogRoot} from "./dialog-root"
import {DialogTrigger} from "./dialog-trigger"

type DialogComponent = {
  /**
   * An overlay displayed beneath the dialog to prevent interaction with the
   * rest of the page. Renders a `<div>` element by default.
   */
  Backdrop: typeof DialogBackdrop
  /**
   * The main content of the dialog. Container for the heading, description,
   * indicator icon, and primary content of the dialog. Renders a `<div>`
   * element by default.
   */
  Body: typeof DialogBody
  /**
   * A button that closes the dialog. Renders a `<button>` element by default.
   */
  CloseButton: typeof DialogCloseButton
  /**
   * A button that closes the dialog. Doesn't render anything by itself. Uses a
   * render prop to spread its props onto the child element.
   */
  CloseTrigger: typeof DialogCloseTrigger
  /**
   * A container for the dialog contents. Renders a `<section>` element by
   * default.
   */
  Content: typeof DialogContent
  /**
   * A description with additional information about the dialog. Renders a
   * `<div>` element by default.
   */
  Description: typeof DialogDescription
  /**
   * A helper component that combines the portal, backdrop, positioner, and
   * content components.
   */
  FloatingPortal: typeof DialogFloatingPortal
  /**
   * Content that appears at the bottom of the dialog, typically reserved for
   * actions. Renders a `<div>` element by default.
   */
  Footer: typeof DialogFooter
  /**
   * A heading that labels the dialog. Renders an `<h2>` element by default.
   */
  Heading: typeof DialogHeading
  /**
   * An icon that indicates the dialog's status. Renders a `<div>` element by
   * default.
   */
  IndicatorIcon: typeof DialogIndicatorIcon
  /**
   * A container that positions the dialog on the screen. Renders a `<div>`
   * element by default.
   */
  Positioner: typeof DialogPositioner
  /**
   * Groups all parts of the dialog. Doesn't render its own HTML element.
   */
  Root: typeof DialogRoot
  /**
   * Enhances a child element to open the dialog when clicked. Requires a
   * single child element.
   */
  Trigger: typeof DialogTrigger
}

export const Dialog: DialogComponent = {
  Backdrop: DialogBackdrop,
  Body: DialogBody,
  CloseButton: DialogCloseButton,
  CloseTrigger: DialogCloseTrigger,
  Content: DialogContent,
  Description: DialogDescription,
  FloatingPortal: DialogFloatingPortal,
  Footer: DialogFooter,
  Heading: DialogHeading,
  IndicatorIcon: DialogIndicatorIcon,
  Positioner: DialogPositioner,
  Root: DialogRoot,
  Trigger: DialogTrigger,
}
