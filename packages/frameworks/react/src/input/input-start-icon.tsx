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

export interface InputStartIconProps extends ElementRenderProp<"div"> {
  /**
   * lucide-react icon.
   */
  icon: LucideIconOrElement
}

/**
 * An icon placed at the start of the input.
 */
export function InputStartIcon({
  icon,
  ...props
}: InputStartIconProps): ReactElement {
  const context = useQdsInputContext()

  const mergedProps = mergeProps(context.getStartIconBindings(), props)

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      <IconOrNode icon={icon} skipWrapper />
    </PolymorphicElement>
  )
}
