// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {useTextAreaHint} from "@qualcomm-ui/react-core/text-area"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTextAreaContext} from "./qds-text-area-context.js"

export interface TextAreaHintProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * Helper text displayed below the textarea. Renders a `<div>` element by default.
 */
export function TextAreaHint({
  children,
  id,
  ...props
}: TextAreaHintProps): ReactElement {
  const contextProps = useTextAreaHint({id})
  const qdsContext = useQdsTextAreaContext()

  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getHintBindings(),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
