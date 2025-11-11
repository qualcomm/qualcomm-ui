// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import {
  type PasswordInputApiProps,
  splitPasswordInputProps,
} from "@qualcomm-ui/core/password-input"
import {createQdsInputApi} from "@qualcomm-ui/qds-core/input"
import {
  QdsInputContextProvider,
  type QdsReactInputApi,
  type QdsReactInputApiProps,
} from "@qualcomm-ui/react/input"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  CorePasswordInput,
  PasswordInputContextProvider,
} from "@qualcomm-ui/react-core/password-input"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface PasswordInputRootProps
  extends PasswordInputApiProps,
    Omit<QdsReactInputApiProps, "endIcon">,
    Omit<ElementRenderProp<"div">, "defaultValue" | "dir"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function PasswordInputRoot({
  children,
  size,
  startIcon,
  ...props
}: PasswordInputRootProps): ReactElement {
  const [textInputProps, localProps] = splitPasswordInputProps(props)
  const context = CorePasswordInput.usePasswordInput(textInputProps)

  const qdsContext: QdsReactInputApi = useMemo(
    () => createQdsInputApi({size, startIcon}, normalizeProps),
    [size, startIcon],
  )

  const mergedProps = mergeProps(
    context.getRootBindings(),
    qdsContext.getRootBindings(),
    localProps,
  )

  return (
    <PasswordInputContextProvider value={context}>
      <QdsInputContextProvider value={qdsContext}>
        <PolymorphicElement as="div" {...mergedProps}>
          {children}
        </PolymorphicElement>
      </QdsInputContextProvider>
    </PasswordInputContextProvider>
  )
}
