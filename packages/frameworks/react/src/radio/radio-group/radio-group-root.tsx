// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import {type RadioApiProps, splitRadioProps} from "@qualcomm-ui/core/radio"
import {createQdsRadioApi, type QdsRadioApiProps} from "@qualcomm-ui/qds-core/radio"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {RadioContextProvider, useRadio} from "@qualcomm-ui/react-core/radio"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsRadioContextProvider} from "../qds-radio-context"

export interface RadioGroupRootProps
  extends RadioApiProps,
    QdsRadioApiProps,
    Omit<ElementRenderProp<"fieldset">, "defaultValue" | "dir"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function RadioGroupRoot({
  children,
  id,
  size,
  ...props
}: RadioGroupRootProps): ReactElement {
  const [radioProps, localProps] = splitRadioProps(props)
  const context = useRadio(radioProps)
  const qdsContext = useMemo(
    () => createQdsRadioApi({size}, normalizeProps),
    [size],
  )

  const mergedProps = mergeProps(
    context.getGroupBindings({id: useControlledId(id)}),
    qdsContext.getGroupBindings(),
    localProps,
  )

  return (
    <QdsRadioContextProvider value={qdsContext}>
      <RadioContextProvider value={context}>
        <PolymorphicElement as="fieldset" {...mergedProps}>
          {children}
        </PolymorphicElement>
      </RadioContextProvider>
    </QdsRadioContextProvider>
  )
}
