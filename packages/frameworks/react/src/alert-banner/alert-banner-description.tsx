// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useAlertBannerContext} from "./qds-alert-banner-context.js"

export interface AlertBannerDescriptionProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * Description of the alert banner. Renders a `<div>` element by default.
 */
export function AlertBannerDescription({
  children,
  ...props
}: AlertBannerDescriptionProps): ReactElement {
  const context = useAlertBannerContext()

  const mergedProps = mergeProps(context.getDescriptionBindings(), props)

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
