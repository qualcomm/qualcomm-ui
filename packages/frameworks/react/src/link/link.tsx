// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  createQdsLinkApi,
  type QdsLinkApiProps,
} from "@qualcomm-ui/qds-core/link"
import {IconOrNode} from "@qualcomm-ui/react/icon"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import type {Explicit} from "@qualcomm-ui/utils/guard"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface LinkProps
  extends QdsLinkApiProps,
    Omit<ElementRenderProp<"a">, "dir"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * Icon positioned after the text content.  If supplied as a
   * `LucideIcon`, the size will automatically match the {@link size} prop.
   * Supply as a `ReactElement` for additional customization.
   */
  endIcon?: LucideIconOrElement

  /**
   * Icon positioned before the text content.  If supplied as a `LucideIcon`,
   * the size will automatically match the {@link size} prop. Supply as a
   * `ReactElement` for additional customization.
   */
  startIcon?: LucideIconOrElement
}

/**
 * A link to another page or resource. Renders an `<a>` element by default.
 */
export function Link({
  children,
  dir,
  disabled,
  emphasis,
  endIcon,
  size,
  startIcon,
  ...props
}: LinkProps): ReactElement {
  const api = createQdsLinkApi(
    {dir, disabled, emphasis, size} satisfies Explicit<QdsLinkApiProps>,
    normalizeProps,
  )
  const mergedProps = mergeProps(api.getRootBindings(), props)

  return (
    <PolymorphicElement as="a" {...mergedProps}>
      {startIcon ? (
        <IconOrNode icon={startIcon} {...api.getStartIconBindings()} />
      ) : null}
      {children}
      {endIcon ? (
        <IconOrNode icon={endIcon} {...api.getEndIconBindings()} />
      ) : null}
    </PolymorphicElement>
  )
}
