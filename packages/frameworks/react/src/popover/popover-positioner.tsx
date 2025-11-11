// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {useOnDestroyWhen} from "@qualcomm-ui/react-core/effects"
import {usePopoverContext} from "@qualcomm-ui/react-core/popover"
import {Portal} from "@qualcomm-ui/react-core/portal"
import {usePresenceContext} from "@qualcomm-ui/react-core/presence"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface PopoverPositionerProps extends ElementRenderProp<"div"> {
  children?: ReactNode
  id?: string
}

export function PopoverPositioner({
  children,
  id,
  ...props
}: PopoverPositionerProps): ReactNode {
  const popover = usePopoverContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(
    popover.getPositionerBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroyWhen(presence.unmounted),
    }),
    props,
  )

  if (presence.unmounted) {
    return null
  }

  return (
    <Portal disabled={!popover.portalled}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </Portal>
  )
}
