// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import {splitSwitchProps, type SwitchApiProps} from "@qualcomm-ui/core/switch"
import {createQdsSwitchApi, type QdsSwitchApiProps} from "@qualcomm-ui/qds-core/switch"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {SwitchContextProvider, useSwitch} from "@qualcomm-ui/react-core/switch"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsSwitchContextProvider} from "./qds-switch-context"

export interface SwitchRootProps
  extends SwitchApiProps,
    QdsSwitchApiProps,
    Omit<ElementRenderProp<"label">, "dir"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * Groups all parts of the switch. Renders a `<label>` element by default.
 */
export function SwitchRoot({
  children,
  id,
  size,
  ...props
}: SwitchRootProps): ReactElement {
  const [switchProps, localProps] = splitSwitchProps(props)
  const context = useSwitch(switchProps)

  const qdsContext = useMemo(
    () => createQdsSwitchApi({size}, normalizeProps),
    [size],
  )

  const mergedProps = mergeProps(
    context.getRootBindings({id: useControlledId(id)}),
    qdsContext.getRootBindings(),
    localProps,
  )

  return (
    <SwitchContextProvider value={context}>
      <QdsSwitchContextProvider value={qdsContext}>
        <PolymorphicElement as="label" {...mergedProps}>
          {children}
        </PolymorphicElement>
      </QdsSwitchContextProvider>
    </SwitchContextProvider>
  )
}
