// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useQdsInputContext} from "@qualcomm-ui/react/input"
import {
  CoreSelect,
  type CoreSelectControlProps,
} from "@qualcomm-ui/react-core/select"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSelectContext} from "./qds-select-context"
import {SelectIcon} from "./select-icon"

export interface SelectControlProps extends CoreSelectControlProps {}

/**
 * The trigger that opens and closes the select menu. Renders a `<div>` element
 * by default.
 */
export function SelectControl({
  children,
  ...props
}: SelectControlProps): ReactElement {
  const qdsInputContext = useQdsInputContext()
  const qdsContext = useQdsSelectContext()
  const mergedProps = mergeProps(qdsContext.getControlBindings(), props)

  return (
    <CoreSelect.Control {...mergedProps}>
      {qdsInputContext?.startIcon ? (
        <SelectIcon icon={qdsInputContext.startIcon} />
      ) : null}
      {children}
    </CoreSelect.Control>
  )
}
