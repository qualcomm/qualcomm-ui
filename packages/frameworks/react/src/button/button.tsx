// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  createQdsButtonApi,
  resolveButtonProps,
} from "@qualcomm-ui/qds-core/button"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {PolymorphicElement} from "@qualcomm-ui/react-core/system"
import {IconOrNode} from "@qualcomm-ui/react/icon"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useButtonGroupContext} from "./button-group-context.js"
import {useButtonPropsContext} from "./button-props-context.js"
import type {ButtonProps} from "./button.types.js"

/**
 * A styled button. Renders a `<button>` element by default.
 */
export function Button({
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
  const api = createQdsButtonApi(
    resolveButtonProps(
      {density, disabled, emphasis, size, variant},
      {defaults: useButtonPropsContext(), group: useButtonGroupContext()},
    ),
    normalizeProps,
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
