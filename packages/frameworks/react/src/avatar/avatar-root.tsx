// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import {type AvatarApiProps, splitAvatarProps} from "@qualcomm-ui/core/avatar"
import {
  createQdsAvatarApi,
  type QdsAvatarApiProps,
} from "@qualcomm-ui/qds-core/avatar"
import {AvatarContextProvider, useAvatar} from "@qualcomm-ui/react-core/avatar"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsAvatarContextProvider} from "./qds-avatar-context"

export interface AvatarRootProps
  extends AvatarApiProps,
    QdsAvatarApiProps,
    IdProp,
    Omit<ElementRenderProp<"div">, "dir"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * Displays a user's profile picture, initials, or fallback icon. Renders a `<span>`
 * element by default.
 */
export function AvatarRoot({
  children,
  id,
  size,
  status,
  variant,
  ...props
}: AvatarRootProps): ReactElement {
  const [avatarProps, localProps] = splitAvatarProps(props)
  const context = useAvatar(avatarProps)
  const qdsContext = useMemo(
    () => createQdsAvatarApi({size, status, variant}, normalizeProps),
    [size, status, variant],
  )
  const mergedProps = mergeProps(
    context.getRootBindings({id: useControlledId(id)}),
    qdsContext.getRootBindings(),
    localProps,
  )

  return (
    <QdsAvatarContextProvider value={qdsContext}>
      <AvatarContextProvider value={context}>
        <PolymorphicElement as="div" {...mergedProps}>
          {children}
        </PolymorphicElement>
      </AvatarContextProvider>
    </QdsAvatarContextProvider>
  )
}
