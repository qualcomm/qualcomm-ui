// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {getQdsButtonGroupBindings} from "@qualcomm-ui/qds-core/button"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {PolymorphicElement} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {ButtonGroupContextProvider} from "./button-group-context"
import type {ButtonGroupProps} from "./button.types"

/**
 * A component for grouping related buttons. Renders as a `<div>` by default.
 */
export function ButtonGroup({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  children,
  density,
  disabled,
  emphasis,
  layout,
  size,
  variant,
  ...props
}: ButtonGroupProps) {
  const mergedProps = mergeProps(
    getQdsButtonGroupBindings(
      {
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        density,
        disabled,
        emphasis,
        layout,
        size,
        variant,
      },
      normalizeProps,
    ),
    props,
  )

  return (
    <ButtonGroupContextProvider
      value={{density, disabled, emphasis, size, variant}}
    >
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </ButtonGroupContextProvider>
  )
}
