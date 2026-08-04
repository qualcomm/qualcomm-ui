// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useSelectItemContext} from "@qualcomm-ui/react-core/select"
import {Checkmark, type CheckmarkProps} from "@qualcomm-ui/react/checkmark"

export interface SelectItemCheckboxProps extends Omit<
  CheckmarkProps,
  "checked"
> {}

/**
 * Checkbox-style indicator for select items. Always visible, showing a checkbox
 * that fills when selected. Use with `selectionIndicator="checkbox"` on the
 * Select root.
 */
export function SelectItemCheckbox(
  props: SelectItemCheckboxProps,
): ReactElement {
  const itemContext = useSelectItemContext()

  return <Checkmark checked={itemContext.selected} {...props} />
}
