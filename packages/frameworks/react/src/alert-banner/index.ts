import {
  AlertBannerActionContainer,
  type AlertBannerActionContainerProps,
} from "./alert-banner-action-container.js"
import {
  AlertBannerButton,
  type AlertBannerButtonProps,
} from "./alert-banner-button.js"
import {
  AlertBannerCloseButton,
  type AlertBannerCloseButtonProps,
} from "./alert-banner-close-button.js"
import {
  AlertBannerDescription,
  type AlertBannerDescriptionProps,
} from "./alert-banner-description.js"
import {
  AlertBannerHeading,
  type AlertBannerHeadingProps,
} from "./alert-banner-heading.js"
import {
  AlertBannerIcon,
  type AlertBannerIconProps,
} from "./alert-banner-icon.js"
import {
  AlertBannerRoot,
  type AlertBannerRootProps,
} from "./alert-banner-root.js"
import {
  type AlertBannerProps,
  AlertBanner as SimpleAlertBanner,
} from "./alert-banner.js"

export * from "./qds-alert-banner-context.js"
export type {
  AlertBannerIconProps,
  AlertBannerActionContainerProps,
  AlertBannerButtonProps,
  AlertBannerCloseButtonProps,
  AlertBannerRootProps,
  AlertBannerDescriptionProps,
  AlertBannerHeadingProps,
  AlertBannerProps,
}

type AlertBannerComponent = typeof SimpleAlertBanner & {
  /**
   * A container for the banner's primary action button. Renders a `<div>`
   * element by default.
   */
  ActionContainer: typeof AlertBannerActionContainer
  Button: typeof AlertBannerButton
  /**
   * Calls the root's `onClose` when clicked. Renders a `<button>` element by
   * default.
   */
  CloseButton: typeof AlertBannerCloseButton
  /**
   * Description of the alert banner. Renders a `<div>` element by default.
   */
  Description: typeof AlertBannerDescription
  /**
   * Heading of the alert banner. Renders a `<div>` element by default.
   */
  Heading: typeof AlertBannerHeading
  /**
   * An icon that indicates the banner's status. Renders a `<span>` element by
   * default.
   */
  Icon: typeof AlertBannerIcon
  /**
   * Groups all parts of the alert banner. Renders a `<div>` element by default.
   */
  Root: typeof AlertBannerRoot
}

export const AlertBanner: AlertBannerComponent =
  SimpleAlertBanner as AlertBannerComponent

AlertBanner.Icon = AlertBannerIcon
AlertBanner.ActionContainer = AlertBannerActionContainer
AlertBanner.Button = AlertBannerButton
AlertBanner.CloseButton = AlertBannerCloseButton
AlertBanner.Root = AlertBannerRoot
AlertBanner.Description = AlertBannerDescription
AlertBanner.Heading = AlertBannerHeading
