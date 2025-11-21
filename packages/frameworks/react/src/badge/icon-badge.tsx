// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  createQdsIconBadgeApi,
  type QdsIconBadgeProps as QdsIconBadgeProps,
} from "@qualcomm-ui/qds-core/badge"
import {IconOrNode} from "@qualcomm-ui/react/icon"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface IconBadgeProps
  extends QdsIconBadgeProps,
    ElementRenderProp<"span"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   * When provided, overrides the icon prop.
   */
  children?: ReactNode

  /**
   * {@link https://lucide.dev lucide-react} icon to display in the badge.
   */
  icon?: LucideIconOrElement
}

export function IconBadge({
  children,
  disabled,
  emphasis,
  icon,
  size,
  variant,
  ...restProps
}: IconBadgeProps): ReactElement {
  const qdsApi = createQdsIconBadgeApi(
    {
      disabled,
      emphasis,
      size,
      variant,
    },
    normalizeProps,
  )

  const mergedProps = mergeProps(qdsApi.getRootBindings(), restProps)

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {children ||
        (icon ? (
          <IconOrNode icon={icon} {...qdsApi.getIconBindings()} />
        ) : null)}
    </PolymorphicElement>
  )
}
