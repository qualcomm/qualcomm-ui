// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreCombobox,
  type CoreComboboxPositionerProps,
} from "@qualcomm-ui/react-core/combobox"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsComboboxContext} from "./qds-combobox-context"

export interface ComboboxPositionerProps extends CoreComboboxPositionerProps {}

/**
 * Positions the combobox menu relative to the control. Renders a `<div>` element by
 * default.
 */
export function ComboboxPositioner(
  props: ComboboxPositionerProps,
): ReactElement {
  const qdsContext = useQdsComboboxContext()
  const mergedProps = mergeProps(qdsContext.getPositionerBindings(), props)

  return <CoreCombobox.Positioner {...mergedProps} />
}
