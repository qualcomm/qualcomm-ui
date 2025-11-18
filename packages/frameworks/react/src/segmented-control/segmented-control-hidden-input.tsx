// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useCheckboxHiddenInput} from "@qualcomm-ui/react-core/checkbox"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSegmentedControlContext} from "./qds-segmented-control-context"

export interface SegmentedControlHiddenInputProps
  extends ElementRenderProp<"input"> {}

/**
 * A segmented control item's hidden input. Renders as an `<input type=radio>` by
 * default.
 */
export function SegmentedControlHiddenInput({
  id,
  ...props
}: SegmentedControlHiddenInputProps): ReactElement {
  const context = useCheckboxHiddenInput({id})
  const qdsContext = useQdsSegmentedControlContext()
  const mergedProps = mergeProps(
    context,
    qdsContext.getItemHiddenInputBindings(),
    props,
  )

  return <PolymorphicElement as="input" {...mergedProps} />
}
