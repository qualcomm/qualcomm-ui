// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {IconOrNode} from "@qualcomm-ui/react/icon"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsInputContext} from "./qds-input-context"

export interface InputErrorTextProps extends ElementRenderProp<"div"> {
  /**
   * An icon to display next to the error text.
   */
  icon?: LucideIconOrElement
}

/**
 * Error text displayed if the control fails validation. Renders a `<div>`
 * element by default.
 */
export function InputErrorText({
  children,
  icon,
  ...props
}: InputErrorTextProps): ReactElement {
  const qdsContext = useQdsInputContext(false)

  const mergedProps = mergeProps(qdsContext?.getErrorTextBindings(), props)

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {icon ? <IconOrNode icon={icon} /> : null}
      {children}
    </PolymorphicElement>
  )
}
