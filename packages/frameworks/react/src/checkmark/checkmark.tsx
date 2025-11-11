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

import {CheckmarkIcon} from "./checkmark-icon"

export interface CheckmarkProps
  extends ElementRenderProp<"div">,
    QdsCheckmarkApiProps {}

export function Checkmark({
  checked,
  disabled,
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

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      <CheckmarkIcon indeterminate={indeterminate} {...api.getIconBindings()} />
    </PolymorphicElement>
  )
}
