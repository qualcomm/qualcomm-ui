// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import {
  createQdsInlineIconButtonApi,
  type QdsInlineIconButtonApiProps,
} from "@qualcomm-ui/qds-core/inline-icon-button"
import {IconOrNode} from "@qualcomm-ui/react/icon"
import type {LucideIconOrNode} from "@qualcomm-ui/react-core/lucide"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface InlineIconButtonProps
  extends QdsInlineIconButtonApiProps,
    ElementRenderProp<"button"> {
  /**
   * Lucide icon to display inside the button.
   */
  icon: LucideIconOrNode
}

/**
 * A small button with an icon that can be used to trigger an action. Typically used
 * within input fields, menu items, or other components that require a small action
 * button. Renders a `<button>` element by default.
 */
export function InlineIconButton({
  emphasis,
  icon,
  size,
  variant,
  ...props
}: InlineIconButtonProps): ReactElement {
  const api = useMemo(
    () =>
      createQdsInlineIconButtonApi({emphasis, size, variant}, normalizeProps),
    [emphasis, size, variant],
  )

  const mergedProps = mergeProps(api.getRootBindings(), props)

  return (
    <PolymorphicElement as="button" {...mergedProps}>
      <IconOrNode icon={icon} {...api.getIconBindings()} />
    </PolymorphicElement>
  )
}
