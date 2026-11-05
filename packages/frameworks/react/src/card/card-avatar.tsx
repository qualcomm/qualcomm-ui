// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {Avatar} from "@qualcomm-ui/react/avatar"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsCardContext} from "./qds-card-context.js"

export interface CardAvatarProps extends Omit<ElementRenderProp<"div">, "dir"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * A slot for an avatar within the card. Renders a `<div>` element by default.
 */
export function CardAvatar(props: CardAvatarProps): ReactElement {
  const qdsContext = useQdsCardContext()
  const mergedProps = mergeProps(qdsContext.getAvatarBindings(), props)

  return <Avatar.Root {...mergedProps} />
}
