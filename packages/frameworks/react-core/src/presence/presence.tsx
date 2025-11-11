// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {
  type PresenceApiProps,
  type RenderStrategyApiProps,
  splitPresenceProps,
} from "@qualcomm-ui/core/presence"
import {composeRefs} from "@qualcomm-ui/react-core/refs"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"

import {usePresence} from "./use-presence"

export interface PresenceProps
  extends PresenceApiProps,
    RenderStrategyApiProps,
    ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function Presence({children, ref, ...props}: PresenceProps): ReactNode {
  const [presenceProps, localProps] = splitPresenceProps(props)
  const presenceApi = usePresence(presenceProps)

  if (presenceApi.unmounted) {
    return null
  }

  return (
    <PolymorphicElement
      as="div"
      {...localProps}
      {...presenceApi.getPresenceBindings()}
      ref={composeRefs(presenceApi.ref, ref)}
    >
      {children}
    </PolymorphicElement>
  )
}
