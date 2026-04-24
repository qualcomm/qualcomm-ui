// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import {
  createQdsAlertBannerApi,
  type QdsAlertBannerApiProps,
} from "@qualcomm-ui/qds-core/alert-banner"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {
  AlertBannerContextProvider,
  type AlertBannerContextValue,
} from "./qds-alert-banner-context"

export interface AlertBannerRootProps
  extends QdsAlertBannerApiProps, Omit<ElementRenderProp<"div">, "dir"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * Callback fired when the close button is clicked.
   */
  onClose?: () => void
}

/**
 * Groups all parts of the alert banner. Renders a `<div>` element by default.
 */
export function AlertBannerRoot({
  children,
  closeButtonAriaLabel,
  dir,
  emphasis,
  onClose,
  variant,
  ...props
}: AlertBannerRootProps): ReactElement {
  const context: AlertBannerContextValue = useMemo(
    () => ({
      ...createQdsAlertBannerApi(
        {closeButtonAriaLabel, dir, emphasis, variant},
        normalizeProps,
      ),
      onClose,
    }),
    [closeButtonAriaLabel, dir, emphasis, variant, onClose],
  )

  const mergedProps = mergeProps(context.getRootBindings(), props)

  return (
    <AlertBannerContextProvider value={context}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </AlertBannerContextProvider>
  )
}
