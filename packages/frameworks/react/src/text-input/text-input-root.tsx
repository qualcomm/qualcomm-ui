// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import {
  splitTextInputProps,
  type TextInputApiProps,
} from "@qualcomm-ui/core/text-input"
import {createQdsInputApi} from "@qualcomm-ui/qds-core/input"
import {
  QdsInputContextProvider,
  type QdsReactInputApiProps,
} from "@qualcomm-ui/react/input"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {
  TextInputContextProvider,
  useTextInput,
} from "@qualcomm-ui/react-core/text-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TextInputRootProps
  extends TextInputApiProps,
    QdsReactInputApiProps,
    Omit<ElementRenderProp<"div">, "dir" | "defaultValue"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * Groups all parts of the text input. Renders a `<div>` element by default.
 */
export function TextInputRoot({
  children,
  endIcon,
  size,
  startIcon,
  ...props
}: TextInputRootProps): ReactElement {
  const [textInputProps, localProps] = splitTextInputProps(props)
  const context = useTextInput(textInputProps)

  const qdsContext = useMemo(
    () => createQdsInputApi({endIcon, size, startIcon}, normalizeProps),
    [endIcon, size, startIcon],
  )

  const mergedProps = mergeProps(
    context.getRootBindings(),
    qdsContext.getRootBindings(),
    localProps,
  )

  return (
    <TextInputContextProvider value={context}>
      <QdsInputContextProvider value={qdsContext}>
        <PolymorphicElement as="div" {...mergedProps}>
          {children}
        </PolymorphicElement>
      </QdsInputContextProvider>
    </TextInputContextProvider>
  )
}
