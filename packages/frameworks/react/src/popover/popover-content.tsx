// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {popoverClasses} from "@qualcomm-ui/qds-core/popover"
import {useOnDestroyWhen} from "@qualcomm-ui/react-core/effects"
import {usePopoverContext} from "@qualcomm-ui/react-core/popover"
import {usePresenceContext} from "@qualcomm-ui/react-core/presence"
import {composeRefs} from "@qualcomm-ui/react-core/refs"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface PopoverContentProps extends ElementRenderProp<"section"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be automatically generated for
   * accessibility.
   */
  id?: string
}

export function PopoverContent({
  children,
  id,
  ref,
  ...props
}: PopoverContentProps): ReactNode {
  const popover = usePopoverContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(
    popover.getContentBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroyWhen(presence.unmounted),
    }),
    {className: popoverClasses.content},
    props,
  )

  if (presence.unmounted) {
    return null
  }

  return (
    <PolymorphicElement
      as="section"
      {...mergedProps}
      ref={composeRefs(presence.ref, ref)}
    >
      {children}
    </PolymorphicElement>
  )
}
