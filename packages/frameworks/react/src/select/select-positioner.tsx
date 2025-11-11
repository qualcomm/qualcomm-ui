// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {CoreSelect} from "@qualcomm-ui/react-core/select"
import type {ElementRenderProp, IdProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSelectContext} from "./qds-select-context"

export interface SelectPositionerProps
  extends IdProp,
    ElementRenderProp<"div"> {}

/**
 * Positions the select menu relative to the trigger. Renders a `<div>` element by
 * default.
 */
export function SelectPositioner(
  props: SelectPositionerProps,
): ReactElement | null {
  const qdsSelectContext = useQdsSelectContext()
  const mergedProps = mergeProps(
    qdsSelectContext.getPositionerBindings(),
    props,
  )

  return <CoreSelect.Positioner {...mergedProps} />
}
