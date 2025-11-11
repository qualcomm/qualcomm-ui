// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {cloneElement, isValidElement} from "react"

import type {LucideIcon} from "lucide-react"

import type {QdsIconSize} from "@qualcomm-ui/qds-core/icon"
import type {LucideIconOrNode} from "@qualcomm-ui/react-core/lucide"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {Icon} from "./icon"

export interface IconOrNodeProps
  extends Omit<ElementRenderProp<"span">, "children"> {
  /**
   * Lucide-react icon
   */
  icon: LucideIconOrNode

  /**
   * The size of the icon. If supplied as a number, the value will be applied as
   * px. Otherwise, the string value of the property will apply. If {@link icon}
   * is a ReactNode, this property will not apply.
   */
  size?: QdsIconSize

  /**
   * If `true` and {@link icon} is a ReactNode, render the ReactNode directly
   * instead of wrapping it with an element.
   */
  skipWrapper?: boolean
}

/**
 * Accepts a lucide-icon or ReactNode as a property and determines which to render
 * based on the type.
 *
 * @internal
 */
export function IconOrNode({
  className,
  icon: iconOrNode,
  ref,
  skipWrapper,
  ...props
}: IconOrNodeProps) {
  if (isValidElement(iconOrNode)) {
    return skipWrapper ? (
      cloneElement(
        iconOrNode,
        mergeProps({className, ref}, props, iconOrNode?.props ?? {}),
      )
    ) : (
      <PolymorphicElement
        ref={ref}
        as="span"
        className={className}
        data-test-id="qui-icon"
        {...props}
      >
        {iconOrNode}
      </PolymorphicElement>
    )
  }
  return (
    <Icon
      ref={ref as any}
      className={className}
      data-test-id="qui-icon"
      icon={iconOrNode as LucideIcon}
      {...(props as any)}
    />
  )
}
