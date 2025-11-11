// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {IconOrNode, type IconOrNodeProps} from "@qualcomm-ui/react/icon"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSelectContext} from "./qds-select-context"

export interface SelectIconProps extends Omit<IconOrNodeProps, "size"> {}

export function SelectIcon(props: SelectIconProps): ReactElement {
  const qdsSelectContext = useQdsSelectContext()
  const mergedProps = mergeProps(qdsSelectContext.getIconBindings(), props)
  return <IconOrNode {...mergedProps} />
}
