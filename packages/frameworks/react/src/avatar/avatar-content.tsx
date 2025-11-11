// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import type {LucideIcon} from "lucide-react"

import {IconOrNode} from "@qualcomm-ui/react/icon"
import {useAvatarContent} from "@qualcomm-ui/react-core/avatar"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsAvatarContext} from "./qds-avatar-context"

export interface AvatarContentProps extends IdProp, ElementRenderProp<"span"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * Icon content.
   */
  icon?: ReactNode | LucideIcon
}

/**
 * Displays alternate content, such as initials or an icon, and acts as a fallback
 * if the image fails to load. Renders a `<span>` element by default.
 */
export function AvatarContent({
  children,
  icon,
  id,
  ...props
}: AvatarContentProps) {
  const contextProps = useAvatarContent({id})
  const qdsContext = useQdsAvatarContext()

  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getContentBindings(),
    props,
  )

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {icon ? <IconOrNode icon={icon} /> : children}
    </PolymorphicElement>
  )
}
