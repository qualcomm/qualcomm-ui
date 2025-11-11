// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import {createQdsButtonApi} from "@qualcomm-ui/qds-core/button"
import {IconOrNode} from "@qualcomm-ui/react/icon"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {PolymorphicElement} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import type {ButtonProps} from "../button.types"

export function InternalButton({
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
  const api = useMemo(
    () =>
      createQdsButtonApi(
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
