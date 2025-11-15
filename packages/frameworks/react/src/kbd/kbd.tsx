// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {getQdsKbdBindings} from "@qualcomm-ui/qds-core/kbd"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface KbdProps extends ElementRenderProp<"div"> {}

export function Kbd({children, ...props}: KbdProps): ReactElement {
  const mergedProps = mergeProps(getQdsKbdBindings(normalizeProps), props)

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
