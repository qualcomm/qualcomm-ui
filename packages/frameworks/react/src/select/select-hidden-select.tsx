// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreSelect,
  type CoreSelectHiddenSelectProps,
} from "@qualcomm-ui/react-core/select"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSelectContext} from "./qds-select-context"

export interface SelectHiddenSelectProps extends CoreSelectHiddenSelectProps {}

/**
 * Hidden native select element for form submission. Renders a `<select>` element.
 */
export function SelectHiddenSelect(
  props: SelectHiddenSelectProps,
): ReactElement {
  const qdsSelectContext = useQdsSelectContext()
  const mergedProps = mergeProps(
    qdsSelectContext.getHiddenSelectBindings(),
    props,
  )

  return <CoreSelect.HiddenSelect {...mergedProps} />
}
