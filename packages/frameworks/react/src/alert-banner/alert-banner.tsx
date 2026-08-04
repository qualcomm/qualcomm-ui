// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import type {LucideIconOrNode} from "@qualcomm-ui/react-core/lucide"

import {
  AlertBannerActionContainer,
  type AlertBannerActionContainerProps,
} from "./alert-banner-action-container.js"
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

export interface AlertBannerProps extends Omit<
  AlertBannerRootProps,
  "children"
> {
  /**
   * The component used for the content of the action element.
   */
  action?: ReactNode

  /**
   * Props applied to the action container element.
   * @inheritDoc
   */
  actionProps?: AlertBannerActionContainerProps

  /**
   * The simple AlertBanner doesn't support children.
   */
  children?: never

  /**
   * Props applied to the close button element.
   * @inheritDoc
   */
  closeButtonProps?: AlertBannerCloseButtonProps

  /**
   * Optional description text for the banner.
   */
  description?: ReactNode

  /**
   * Props applied to the description element.
   * @inheritDoc
   */
  descriptionProps?: AlertBannerDescriptionProps

  /**
   * When `true`, renders a close button that calls `onClose` when clicked.
   */
  dismissable?: boolean

  /**
   * Optional heading text for the banner.
   */
  heading?: ReactNode

  /**
   * Props applied to the heading element.
   * @inheritDoc
   */
  headingProps?: AlertBannerHeadingProps

  /**
   * Override the icon displayed in the banner. When this prop is omitted,
   * the icon is determined by the {@link emphasis} prop.
   */
  icon?: LucideIconOrNode

  /**
   * Props applied to the icon element.
   * @inheritDoc
   */
  iconProps?: AlertBannerIconProps
}

export function AlertBanner({
  action,
  actionProps,
  closeButtonProps,
  description,
  descriptionProps,
  dismissable,
  heading,
  headingProps,
  icon,
  iconProps,
  ...props
}: AlertBannerProps): ReactElement {
  const headingContent = heading || headingProps?.children
  const descriptionContent = description || descriptionProps?.children
  const actionContent = action || actionProps?.children

  return (
    <AlertBannerRoot {...props}>
      <AlertBannerIcon icon={icon} {...iconProps} />

      {headingContent ? (
        <AlertBannerHeading {...headingProps}>
          {headingContent}
        </AlertBannerHeading>
      ) : null}

      {descriptionContent ? (
        <AlertBannerDescription {...descriptionProps}>
          {descriptionContent}
        </AlertBannerDescription>
      ) : null}

      {actionContent ? (
        <AlertBannerActionContainer {...actionProps}>
          {actionContent}
        </AlertBannerActionContainer>
      ) : null}

      {dismissable ? <AlertBannerCloseButton {...closeButtonProps} /> : null}
    </AlertBannerRoot>
  )
}
