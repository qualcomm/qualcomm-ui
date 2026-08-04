// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import {ChevronDown, type LucideIcon} from "lucide-react"

import {
  createQdsIconButtonApi,
  resolveButtonPropsWithGroup,
} from "@qualcomm-ui/qds-core/button"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {PolymorphicElement} from "@qualcomm-ui/react-core/system"
import {
  type IconButtonProps,
  useButtonGroupContext,
} from "@qualcomm-ui/react/button"
import {Icon} from "@qualcomm-ui/react/icon"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsMenuContext} from "./qds-menu-context.js"

export interface MenuIconButtonProps extends Omit<IconButtonProps, "icon"> {
  /**
   * Optional {@link https://lucide.dev lucide-react} icon displayed alongside the
   * chevron indicator. When omitted, only the chevron is rendered.
   */
  icon?: LucideIcon
}

export function MenuIconButton({
  density,
  disabled,
  emphasis,
  icon,
  shape,
  size,
  variant,
  ...props
}: MenuIconButtonProps): ReactElement {
  const qdsMenuContext = useQdsMenuContext()
  const {
    density: resolvedDensity,
    disabled: resolvedDisabled,
    emphasis: resolvedEmphasis,
    size: resolvedSize,
    variant: resolvedVariant,
  } = resolveButtonPropsWithGroup(useButtonGroupContext(), {
    density,
    disabled,
    emphasis,
    size: size ?? qdsMenuContext.size,
    variant,
  })

  const api = useMemo(
    () =>
      createQdsIconButtonApi(
        {
          density: resolvedDensity,
          disabled: resolvedDisabled,
          emphasis: resolvedEmphasis,
          shape,
          size: resolvedSize,
          variant: resolvedVariant,
        },
        normalizeProps,
      ),
    [
      resolvedDensity,
      resolvedDisabled,
      resolvedEmphasis,
      shape,
      resolvedSize,
      resolvedVariant,
    ],
  )

  const mergedProps = mergeProps(
    api.getRootBindings(),
    qdsMenuContext.getButtonBindings(),
    props,
  )

  return (
    <PolymorphicElement as="button" {...mergedProps}>
      {icon && <Icon icon={icon} {...api.getIconBindings()} />}
      <Icon
        {...qdsMenuContext.getIndicatorBindings()}
        icon={ChevronDown}
        size={resolvedSize}
      />
    </PolymorphicElement>
  )
}
