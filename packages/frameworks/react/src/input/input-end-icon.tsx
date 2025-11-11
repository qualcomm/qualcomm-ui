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

export interface InputEndIconProps extends ElementRenderProp<"div"> {
  /**
   * lucide-react icon or ReactNode.
   */
  icon: LucideIconOrElement
}

/**
 * An icon placed at the end of the input.
 */
export function InputEndIcon({
  icon,
  ...props
}: InputEndIconProps): ReactElement {
  const context = useQdsInputContext()

  const mergedProps = mergeProps(context.getEndIconBindings(), props)

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      <IconOrNode icon={icon} skipWrapper />
    </PolymorphicElement>
  )
}
