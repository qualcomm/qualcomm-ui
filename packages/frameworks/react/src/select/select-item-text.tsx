// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {selectClasses} from "@qualcomm-ui/qds-core/select"
import {
  CoreSelect,
  type CoreSelectItemTextProps,
} from "@qualcomm-ui/react-core/select"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface SelectItemTextProps extends CoreSelectItemTextProps {}

export function SelectItemText(props: SelectItemTextProps): ReactElement {
  const mergedProps = mergeProps({className: selectClasses.itemText}, props)

  return <CoreSelect.ItemText {...mergedProps} />
}
