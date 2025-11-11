// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {CoreSelect, type CoreSelectContentProps} from "@qualcomm-ui/react-core/select"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSelectContext} from "./qds-select-context"

export interface SelectContentProps extends CoreSelectContentProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * Container for the select options. Renders a `<div>` element by default.
 */
export function SelectContent({
  children,
  ...props
}: SelectContentProps): ReactElement {
  const qdsContext = useQdsSelectContext()
  const mergedProps = mergeProps(qdsContext.getContentBindings(), props)

  return <CoreSelect.Content {...mergedProps}>{children}</CoreSelect.Content>
}
