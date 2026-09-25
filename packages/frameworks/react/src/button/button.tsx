// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  createQdsButtonApi,
  resolveButtonPropsWithGroup,
} from "@qualcomm-ui/qds-core/button"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {PolymorphicElement} from "@qualcomm-ui/react-core/system"
import {BadgeContextProvider} from "@qualcomm-ui/react/badge"
import {IconOrNode} from "@qualcomm-ui/react/icon"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useButtonGroupContext} from "./button-group-context.js"
import type {ButtonProps} from "./button.types.js"

/**
 * A styled button. Renders a `<button>` element by default.
 */
export function Button({
  badge,
  children,
  density,
  disabled,
  emphasis,
  endIcon,
  size,
  startIcon,
  variant,
  ...props
}: ButtonProps): ReactElement {
  const resolved = resolveButtonPropsWithGroup(useButtonGroupContext(), {
    density,
    disabled,
    emphasis,
    size,
    variant,
  })
  const api = createQdsButtonApi(resolved, normalizeProps)
  const mergedProps = mergeProps(api.getRootBindings(), props)

  return (
    <BadgeContextProvider
      value={{
        numberBadge: {
          disabled: resolved.disabled,
          emphasis: api.numberBadgeEmphasis,
          size: api.numberBadgeSize,
        },
        statusBadge: {disabled: resolved.disabled, size: api.statusBadgeSize},
      }}
    >
      <PolymorphicElement as="button" {...mergedProps}>
        {startIcon ? (
          <IconOrNode icon={startIcon} {...api.getStartIconBindings()} />
        ) : null}
        {children}
        {badge}
        {endIcon ? (
          <IconOrNode icon={endIcon} {...api.getEndIconBindings()} />
        ) : null}
      </PolymorphicElement>
    </BadgeContextProvider>
  )
}
