// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {useAvatarStatus} from "@qualcomm-ui/react-core/avatar"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsAvatarContext} from "./qds-avatar-context"

export interface AvatarStatusProps extends IdProp, ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * Displays a status indicator dot for the avatar. Renders a `<div>` element by
 * default.
 */
export function AvatarStatus({children, id, ...props}: AvatarStatusProps) {
  const contextProps = useAvatarStatus({id})
  const qdsContext = useQdsAvatarContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getStatusBindings(),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
