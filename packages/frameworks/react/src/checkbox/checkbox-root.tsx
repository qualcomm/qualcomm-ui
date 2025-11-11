// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import {
  type CheckboxApiProps,
  splitCheckboxProps,
} from "@qualcomm-ui/core/checkbox"
import {
  createQdsCheckboxApi,
  type QdsCheckboxApiProps,
} from "@qualcomm-ui/qds-core/checkbox"
import {
  CheckboxContextProvider,
  useCheckbox,
} from "@qualcomm-ui/react-core/checkbox"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsCheckboxContextProvider} from "./qds-checkbox-context"

export interface CheckboxRootProps
  extends IdProp,
    CheckboxApiProps,
    QdsCheckboxApiProps,
    Omit<ElementRenderProp<"label">, "dir"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * Groups all parts of the checkbox. Renders a `<label>` element by default.
 */
export function CheckboxRoot({
  children,
  id,
  size,
  ...props
}: CheckboxRootProps): ReactElement {
  const [checkboxProps, localProps] = splitCheckboxProps(props)
  const context = useCheckbox(checkboxProps)
  const qdsContext = useMemo(
    () => createQdsCheckboxApi({size}, normalizeProps),
    [size],
  )
  const mergedProps = mergeProps(
    context.getRootBindings({id: useControlledId(id)}),
    qdsContext.getRootBindings(),
    localProps,
  )

  return (
    <QdsCheckboxContextProvider value={qdsContext}>
      <CheckboxContextProvider value={context}>
        <PolymorphicElement as="label" {...mergedProps}>
          {children}
        </PolymorphicElement>
      </CheckboxContextProvider>
    </QdsCheckboxContextProvider>
  )
}
