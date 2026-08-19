// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import {
  createQdsCheckmarkApi,
  type QdsCheckmarkApiProps,
} from "@qualcomm-ui/qds-core/checkmark"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {
  type CheckboxIndicatorIconProps,
  CheckmarkIcon,
} from "./checkmark-icon.js"

export interface CheckmarkProps
  extends ElementRenderProp<"div">, QdsCheckmarkApiProps {
  iconProps?: Omit<CheckboxIndicatorIconProps, "indeterminate">
}

export function Checkmark({
  checked,
  disabled,
  iconProps,
  indeterminate,
  size,
  ...props
}: CheckmarkProps): ReactElement {
  const api = useMemo(
    () =>
      createQdsCheckmarkApi(
        {
          checked,
          disabled,
          indeterminate,
          size,
        },
        normalizeProps,
      ),
    [checked, disabled, indeterminate, size],
  )
  const mergedProps = mergeProps(api.getRootBindings(), props)
  const mergedCheckmarkIconProps = mergeProps(api.getIconBindings(), iconProps)

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      <CheckmarkIcon
        indeterminate={indeterminate}
        {...mergedCheckmarkIconProps}
      />
    </PolymorphicElement>
  )
}
