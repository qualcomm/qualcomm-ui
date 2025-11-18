// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import type {SegmentedControlItemApiProps} from "@qualcomm-ui/core/segmented-control"
import {IconOrNode} from "@qualcomm-ui/react/icon"
import {CheckboxContextProvider} from "@qualcomm-ui/react-core/checkbox"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {useSegmentedControlItem} from "@qualcomm-ui/react-core/segmented-control"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSegmentedControlContext} from "./qds-segmented-control-context"

export interface SegmentedControlItemRootProps
  extends SegmentedControlItemApiProps,
    ElementRenderProp<"label"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * Icon, positioned before the item label if there is one.
   */
  icon?: LucideIconOrElement
}

/**
 * A segmented control item container. Renders as a `<label>` by default.
 */
export function SegmentedControlItemRoot({
  children,
  disabled,
  icon,
  id,
  value,
  ...props
}: SegmentedControlItemRootProps): ReactElement {
  const context = useSegmentedControlItem({disabled, value})
  const qdsContext = useQdsSegmentedControlContext()
  const finalId = useControlledId(id)
  const mergedProps = mergeProps(
    context.checkboxContext.getRootBindings({id: finalId}),
    context.getItemBindings({id: finalId}),
    qdsContext.getItemBindings(),
    props,
  )

  return (
    <CheckboxContextProvider value={context.checkboxContext}>
      <PolymorphicElement as="label" {...mergedProps}>
        {icon ? <IconOrNode icon={icon} /> : null}
        {children}
      </PolymorphicElement>
    </CheckboxContextProvider>
  )
}
