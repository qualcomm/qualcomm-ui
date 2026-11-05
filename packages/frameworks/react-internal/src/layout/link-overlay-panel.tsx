// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {HTMLAttributes, ReactNode} from "react"

import {ChevronRightIcon, ExternalLinkIcon} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {DocLink} from "./doc-link"

LinkOverlayPanel.displayName = "LinkOverlayPanel"

export interface LinkOverlayPanelProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string
  target?: string
}

export function LinkOverlayPanel({
  children,
  href,
  ...props
}: LinkOverlayPanelProps): ReactNode {
  const isInternalLink = href?.startsWith("/")

  const Element = isInternalLink ? DocLink : "a"

  const mergedProps = mergeProps(
    {
      style: {
        position: "relative",
      },
    },
    props,
  )

  return (
    <Element href={href} {...mergedProps}>
      {children}
      <IconButton
        aria-label="Continue"
        emphasis="neutral"
        icon={isInternalLink ? ChevronRightIcon : ExternalLinkIcon}
        size="sm"
        style={{bottom: 8, position: "absolute", right: 8}}
        variant="outline"
      />
    </Element>
  )
}
