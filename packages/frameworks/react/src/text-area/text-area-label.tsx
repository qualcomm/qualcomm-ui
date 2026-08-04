// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {Asterisk} from "lucide-react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {
  useTextAreaContext,
  useTextAreaLabel,
} from "@qualcomm-ui/react-core/text-area"
import {Icon} from "@qualcomm-ui/react/icon"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTextAreaContext} from "./qds-text-area-context.js"

export interface TextAreaLabelProps extends ElementRenderProp<"label"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * An accessible label that is automatically associated with the input. Renders a
 * `<label>` element by default.
 */
export function TextAreaLabel({
  children,
  id,
  ...props
}: TextAreaLabelProps): ReactElement {
  const contextProps = useTextAreaLabel({id})
  const qdsContext = useQdsTextAreaContext()

  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getLabelBindings(),
    props,
  )

  const {required} = useTextAreaContext()

  return (
    <PolymorphicElement as="label" {...mergedProps}>
      {children}
      {required ? (
        <Icon
          {...qdsContext.getRequiredIndicatorBindings()}
          icon={Asterisk}
          size="xs"
        />
      ) : null}
    </PolymorphicElement>
  )
}
