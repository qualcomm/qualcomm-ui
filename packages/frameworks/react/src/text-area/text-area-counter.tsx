// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {
  useTextAreaContext,
  useTextAreaCounter,
} from "@qualcomm-ui/react-core/text-area"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTextAreaContext} from "./qds-text-area-context.js"

export interface TextAreaCounterProps extends ElementRenderProp<"div"> {
  /**
   * Customize how the counter is displayed. Receives the current character
   * count and optional max length, and returns a React node.
   *
   * @example
   * // Display as "42 of 100"
   * display={(count, max) => max ? `${count} of ${max}` : count}
   */
  display?: (count: number, maxLength?: number) => ReactNode
}

function defaultDisplay(count: number, maxLength?: number): ReactNode {
  return maxLength != null ? `${count}/${maxLength}` : count
}

/**
 * Character counter displayed opposite the textarea label. Renders a `<div>`
 * element by default.
 */
export function TextAreaCounter({
  display = defaultDisplay,
  id,
  ...props
}: TextAreaCounterProps): ReactElement {
  const contextProps = useTextAreaCounter({id})
  const qdsContext = useQdsTextAreaContext()

  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getCounterBindings(),
    props,
  )

  const {maxLength, value} = useTextAreaContext()

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {display(value.length, maxLength)}
    </PolymorphicElement>
  )
}
