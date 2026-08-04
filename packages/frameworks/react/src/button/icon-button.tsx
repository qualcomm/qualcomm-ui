// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {isValidElement, type ReactElement} from "react"

import {
  createQdsIconButtonApi,
  resolveButtonPropsWithGroup,
} from "@qualcomm-ui/qds-core/button"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {PolymorphicElement} from "@qualcomm-ui/react-core/system"
import {Icon, IconOrNode} from "@qualcomm-ui/react/icon"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useButtonGroupContext} from "./button-group-context.js"
import type {IconButtonProps} from "./icon-button.types.js"

/**
 * A styled icon button. Renders a `<button>` element by default.
 */
export function IconButton({
  density,
  disabled,
  emphasis,
  icon,
  shape,
  size,
  variant,
  ...props
}: IconButtonProps): ReactElement {
  const resolved = resolveButtonPropsWithGroup(useButtonGroupContext(), {
    density,
    disabled,
    emphasis,
    size,
    variant,
  })

  const api = createQdsIconButtonApi({...resolved, shape}, normalizeProps)

  const mergedProps = mergeProps(api.getRootBindings(), props)

  return (
    <PolymorphicElement as="button" {...mergedProps}>
      {isValidElement(icon) ? (
        <IconOrNode icon={icon} skipWrapper {...api.getIconBindings()} />
      ) : (
        <Icon icon={icon} {...api.getIconBindings()} />
      )}
    </PolymorphicElement>
  )
}
