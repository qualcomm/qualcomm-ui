// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import type {RadioItemContext} from "@qualcomm-ui/core/radio"
import {
  createQdsRadioApi,
  type QdsRadioApiProps,
} from "@qualcomm-ui/qds-core/radio"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  RadioItemContextProvider,
  useRadioItem,
} from "@qualcomm-ui/react-core/radio"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsRadioContextProvider, useQdsRadioContext} from "./qds-radio-context"

export interface RadioRootProps
  extends RadioItemContext,
    IdProp,
    QdsRadioApiProps,
    ElementRenderProp<"label"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function RadioRoot({
  children,
  disabled,
  id,
  size,
  value,
  ...props
}: RadioRootProps): ReactElement {
  const {bindings, itemContext} = useRadioItem({disabled, id, value})
  const parentContext = useQdsRadioContext(false)
  const qdsContext = useMemo(
    () => createQdsRadioApi({size: size || parentContext.size}, normalizeProps),
    [parentContext.size, size],
  )
  const mergedProps = mergeProps(bindings, qdsContext.getItemBindings(), props)

  return (
    <QdsRadioContextProvider value={qdsContext}>
      <RadioItemContextProvider value={itemContext}>
        <PolymorphicElement as="label" {...mergedProps}>
          {children}
        </PolymorphicElement>
      </RadioItemContextProvider>
    </QdsRadioContextProvider>
  )
}
