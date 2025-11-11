// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {isValidElement, type ReactElement, useMemo} from "react"

import {createQdsIconButtonApi} from "@qualcomm-ui/qds-core/button"
import {Icon, IconOrNode} from "@qualcomm-ui/react/icon"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {PolymorphicElement} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import type {IconButtonProps} from "../icon-button.types"

export function InternalIconButton({
  density,
  disabled,
  emphasis,
  icon,
  size,
  variant,
  ...props
}: IconButtonProps): ReactElement {
  const api = useMemo(
    () =>
      createQdsIconButtonApi(
        {
          density,
          disabled,
          emphasis,
          size,
          variant,
        },
        normalizeProps,
      ),
    [density, disabled, emphasis, size, variant],
  )

  const mergedProps = mergeProps(api.getRootBindings(), props)

  return (
    <PolymorphicElement as="button" {...mergedProps}>
      {isValidElement(icon) ? (
        <IconOrNode
          icon={icon}
          size={size}
          skipWrapper
          {...api.getIconBindings()}
        />
      ) : (
        <Icon icon={icon} {...api.getIconBindings()} />
      )}
    </PolymorphicElement>
  )
}
