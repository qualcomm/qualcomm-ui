// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Ellipsis} from "lucide-react"

import type {PaginationPageItemBindings} from "@qualcomm-ui/core/pagination"
import {Icon} from "@qualcomm-ui/react/icon"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"

/**
 * @interface
 */
export type PaginationPageItemProps = PaginationPageItemBindings &
  ElementRenderProp<"button">

export function PaginationPageItem({
  ...props
}: PaginationPageItemProps): ReactElement {
  const itemType = props["data-type"]

  return (
    <PolymorphicElement as="button" {...props}>
      {itemType === "page" ? props["data-page"] : <Icon icon={Ellipsis} />}
    </PolymorphicElement>
  )
}
