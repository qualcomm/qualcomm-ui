// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsBreadcrumbsContext} from "./qds-breadcrumbs-context"

export interface BreadcrumbsItemTriggerProps extends ElementRenderProp<"a"> {}

export function BreadcrumbsItemTrigger({
  href = "",
  ...props
}: BreadcrumbsItemTriggerProps): ReactElement {
  const qdsContext = useQdsBreadcrumbsContext()
  const mergedProps = mergeProps(qdsContext.getItemTriggerBindings(), {
    href,
    ...props,
  })

  return <PolymorphicElement as="a" {...mergedProps} />
}
