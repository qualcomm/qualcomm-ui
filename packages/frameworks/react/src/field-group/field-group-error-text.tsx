// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {CircleAlert} from "lucide-react"

import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {IconOrNode} from "@qualcomm-ui/react/icon"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFieldGroupContext} from "./qds-field-group-context.js"

export interface FieldGroupErrorTextProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * An icon to display next to the error text.
   * @default `<CircleAlert />`
   */
  icon?: LucideIconOrElement
}

/**
 * Error text for the field group. Renders a `<div>` element by default.
 */
export function FieldGroupErrorText({
  children,
  icon = CircleAlert,
  ...props
}: FieldGroupErrorTextProps): ReactElement {
  const qdsContext = useQdsFieldGroupContext()
  const mergedProps = mergeProps(qdsContext.getErrorTextBindings(), props)

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      <IconOrNode icon={icon} />
      {children}
    </PolymorphicElement>
  )
}
