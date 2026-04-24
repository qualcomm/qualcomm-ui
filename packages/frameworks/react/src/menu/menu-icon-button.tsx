// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import {ChevronDown, type LucideIcon} from "lucide-react"

import {createQdsIconButtonApi} from "@qualcomm-ui/qds-core/button"
import type {IconButtonProps} from "@qualcomm-ui/react/button"
import {Icon} from "@qualcomm-ui/react/icon"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {PolymorphicElement} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsMenuContext} from "./qds-menu-context"

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

  const api = useMemo(
    () =>
      createQdsIconButtonApi(
        {density, disabled, emphasis, shape, size, variant},
        normalizeProps,
      ),
    [density, disabled, emphasis, shape, size, variant],
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
        size={size}
      />
    </PolymorphicElement>
  )
}
