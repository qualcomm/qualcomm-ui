// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {useAvatarImage} from "@qualcomm-ui/react-core/avatar"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsAvatarContext} from "./qds-avatar-context"

export interface AvatarImageProps extends IdProp, ElementRenderProp<"img"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * The image to display in the avatar. Renders an `<img>` element by default.
 */
export function AvatarImage({children, id, ...props}: AvatarImageProps) {
  const contextProps = useAvatarImage({id})
  const qdsContext = useQdsAvatarContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getImageBindings(),
    props,
  )

  return (
    <PolymorphicElement as="img" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
