// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {AlertCircle} from "lucide-react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {useTextAreaErrorText} from "@qualcomm-ui/react-core/text-area"
import {IconOrNode} from "@qualcomm-ui/react/icon"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTextAreaContext} from "./qds-text-area-context.js"

export interface TextAreaErrorTextProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * Error message displayed when the textarea is invalid. Renders a `<div>` element by
 * default.
 */
export function TextAreaErrorText({
  children,
  id,
  ...props
}: TextAreaErrorTextProps): ReactElement {
  const contextProps = useTextAreaErrorText({id})
  const qdsContext = useQdsTextAreaContext()

  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getErrorTextBindings(),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      <IconOrNode icon={AlertCircle} />
      {children}
    </PolymorphicElement>
  )
}
