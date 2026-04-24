// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  type QdsCardLinkApiProps,
  translateCardLinkProps,
} from "@qualcomm-ui/qds-core/card"
import {Link, type LinkProps} from "@qualcomm-ui/react/link"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsCardContext} from "./qds-card-context"

export interface CardLinkProps
  extends Omit<LinkProps, "emphasis" | "size">, QdsCardLinkApiProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * A link within the card footer. Renders an `<a>` element by default.
 */
export function CardLink({variant, ...props}: CardLinkProps): ReactElement {
  const qdsContext = useQdsCardContext()
  const mergedProps = mergeProps(qdsContext.getLinkBindings(), props)

  return <Link {...mergedProps} {...translateCardLinkProps({variant})} />
}
