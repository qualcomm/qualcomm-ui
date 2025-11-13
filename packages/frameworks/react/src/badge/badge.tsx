// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  createQdsBadgeApi,
  type QdsBadgeApiProps,
  type QdsBadgeBasicSize,
  type QdsBadgeCountProps,
  type QdsBadgeExtendedSize,
  type QdsBadgeIconProps,
  type QdsBadgeIconSize,
  type QdsBadgeStatusProps,
  type QdsBadgeTextProps,
} from "@qualcomm-ui/qds-core/badge"
import {IconOrNode} from "@qualcomm-ui/react/icon"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface BadgeCountProps extends Omit<QdsBadgeCountProps, "type"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   * When provided, overrides type-specific content.
   */
  children?: ReactNode

  type: "count"
}

export interface BadgeStatusProps extends Omit<QdsBadgeStatusProps, "type"> {
  type: "status"
}

export interface BadgeIconProps extends Omit<QdsBadgeIconProps, "type"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   * When provided, overrides the icon prop.
   */
  children?: ReactNode

  /**
   * {@link https://lucide.dev lucide-react} icon to display in the badge.
   */
  icon?: LucideIconOrElement

  type: "icon"
}

export interface BadgeTextProps extends Omit<QdsBadgeTextProps, "type"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  type?: "text"
}

export type BadgeProps = ElementRenderProp<"span"> &
  (BadgeCountProps | BadgeStatusProps | BadgeIconProps | BadgeTextProps)

export function Badge(props: BadgeProps): ReactElement {
  const {children, disabled, size, type, ...restProps} = props

  let qdsApiProps: QdsBadgeApiProps

  switch (type) {
    case "count":
      qdsApiProps = {
        count: (props as BadgeCountProps).count,
        disabled,
        max: (props as BadgeCountProps).max,
        size: size as QdsBadgeBasicSize,
        type: "count",
        variant: (props as BadgeCountProps).variant,
      }
      break
    case "status":
      qdsApiProps = {
        disabled,
        emphasis: (props as BadgeStatusProps).emphasis,
        size: size as QdsBadgeExtendedSize,
        type: "status",
        variant: (props as BadgeStatusProps).variant,
      }
      break
    case "icon":
      qdsApiProps = {
        disabled,
        emphasis: (props as BadgeIconProps).emphasis,
        size: size as QdsBadgeIconSize,
        type: "icon",
        variant: (props as BadgeIconProps).variant,
      }
      break
    default:
      qdsApiProps = {
        disabled,
        emphasis: (props as BadgeTextProps).emphasis,
        size: size as QdsBadgeBasicSize,
        type: "text",
        variant: (props as BadgeTextProps).variant,
      }
      break
  }

  const qdsApi = createQdsBadgeApi(qdsApiProps, normalizeProps)

  const rootProps = mergeProps(qdsApi.getRootBindings(), restProps)

  const renderContent = (): ReactNode => {
    switch (qdsApi.type) {
      case "count": {
        // children override prop
        if (children) {
          return children
        }
        const displayCount = qdsApi.getDisplayCount()
        return displayCount ?? null
      }

      case "icon": {
        // children override prop
        if (children) {
          return <span {...qdsApi.getIconBindings()}>{children}</span>
        }
        const icon = (props as BadgeIconProps).icon
        return icon ? (
          <IconOrNode icon={icon} {...qdsApi.getIconBindings()} />
        ) : null
      }

      case "text":
        return children ?? null

      case "status":
      default:
        return null
    }
  }

  return (
    <PolymorphicElement as="span" {...rootProps}>
      {renderContent()}
    </PolymorphicElement>
  )
}
