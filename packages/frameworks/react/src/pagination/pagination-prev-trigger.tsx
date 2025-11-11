// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {ChevronLeft} from "lucide-react"

import {IconOrNode} from "@qualcomm-ui/react/icon"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {usePaginationPrevTrigger} from "@qualcomm-ui/react-core/pagination"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsPaginationContext} from "./qds-pagination-context"

export interface PaginationPrevTriggerProps
  extends ElementRenderProp<"button"> {
  /**
   * lucide-react icon.
   *
   * @default ChevronLeft
   */
  icon?: LucideIconOrElement
}

export function PaginationPrevTrigger({
  icon = ChevronLeft,
  ...props
}: PaginationPrevTriggerProps): ReactElement {
  const contextProps = usePaginationPrevTrigger()
  const qdsContext = useQdsPaginationContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getPageItemBindings(),
    props,
  )

  return (
    <PolymorphicElement as="button" {...mergedProps}>
      <IconOrNode icon={icon} />
    </PolymorphicElement>
  )
}
