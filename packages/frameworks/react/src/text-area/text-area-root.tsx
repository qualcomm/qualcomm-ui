// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import {
  splitTextAreaProps,
  type TextAreaApiProps,
} from "@qualcomm-ui/core/text-area"
import {
  createQdsTextAreaApi,
  type QdsTextAreaApiProps,
} from "@qualcomm-ui/qds-core/text-area"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {
  TextAreaContextProvider,
  useTextArea,
} from "@qualcomm-ui/react-core/text-area"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsTextAreaContextProvider} from "./qds-text-area-context"

export interface TextAreaRootProps
  extends
    TextAreaApiProps,
    QdsTextAreaApiProps,
    Omit<ElementRenderProp<"div">, "dir" | "defaultValue"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * Groups all parts of the text-area. Renders a `<div>` element by default.
 */
export function TextAreaRoot({
  children,
  size,
  ...props
}: TextAreaRootProps): ReactElement {
  const [textAreaProps, localProps] = splitTextAreaProps(props)
  const context = useTextArea(textAreaProps)

  const qdsContext = useMemo(
    () => createQdsTextAreaApi({size}, normalizeProps),
    [size],
  )

  const mergedProps = mergeProps(
    context.getRootBindings(),
    qdsContext.getRootBindings(),
    localProps,
  )

  return (
    <TextAreaContextProvider value={context}>
      <QdsTextAreaContextProvider value={qdsContext}>
        <PolymorphicElement as="div" {...mergedProps}>
          {children}
        </PolymorphicElement>
      </QdsTextAreaContextProvider>
    </TextAreaContextProvider>
  )
}
