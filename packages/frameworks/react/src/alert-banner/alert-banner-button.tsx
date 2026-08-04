// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {resolveAlertBannerButtonProps} from "@qualcomm-ui/qds-core/alert-banner"
import {Button, type ButtonProps} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useAlertBannerContext} from "./qds-alert-banner-context.js"

/**
 * @since 1.21.0
 */
export interface AlertBannerButtonProps extends Omit<
  ButtonProps,
  "density" | "emphasis" | "size" | "variant"
> {}

/**
 * The alert's primary action. Use this instead of `AlertBanner.ActionContainer`
 *
 * @since 1.21.0
 */
export function AlertBannerButton(props: AlertBannerButtonProps): ReactElement {
  const context = useAlertBannerContext()

  const mergedProps = mergeProps(
    context.getActionBindings(),
    resolveAlertBannerButtonProps({
      emphasis: context.emphasis,
      variant: context.variant,
    }),
    props,
  )

  return <Button {...mergedProps} />
}
