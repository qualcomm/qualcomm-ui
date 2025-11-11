// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {CircleAlert} from "lucide-react"

import {IconOrNode} from "@qualcomm-ui/react/icon"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsInputContext} from "./qds-input-context"

export interface InputErrorIndicatorProps extends ElementRenderProp<"span"> {
  /**
   * lucide-react icon or ReactNode.
   *
   * @default CircleAlert
   */
  icon?: LucideIconOrElement
}

/**
 * An error icon displayed if the control fails validation. Renders a `<span>`
 * element by default.
 */
export function InputErrorIndicator(
  props: InputErrorIndicatorProps,
): ReactElement {
  const context = useQdsInputContext()

  const mergedProps = mergeProps(context.getErrorIndicatorBindings(), props, {
    icon: props.icon || CircleAlert,
  })

  return <IconOrNode {...mergedProps} />
}
