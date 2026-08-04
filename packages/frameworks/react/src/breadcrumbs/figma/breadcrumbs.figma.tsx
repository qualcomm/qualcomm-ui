// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"

import type {
  QdsBreadcrumbsEmphasis,
  QdsBreadcrumbsSize,
} from "@qualcomm-ui/qds-core/breadcrumbs"
import {Breadcrumbs} from "@qualcomm-ui/react/breadcrumbs"

// Breadcrumbs Item is mapped via the raw template in ./breadcrumb-item.figma.js

figma.connect(Breadcrumbs.Root, "<FIGMA_COMPONENTS_BASE>?node-id=3728-17610", {
  example: ({children, emphasis, size}) => (
    <Breadcrumbs.Root aria-label="Breadcrumbs" emphasis={emphasis} size={size}>
      <Breadcrumbs.List>{children}</Breadcrumbs.List>
    </Breadcrumbs.Root>
  ),
  props: {
    children: figma.children("_Breadcrumb item"),
    emphasis: figma.enum<QdsBreadcrumbsEmphasis>("emphasis", {
      neutral: "neutral",
    }),
    size: figma.enum<QdsBreadcrumbsSize>("size", {
      lg: "lg",
      sm: "sm",
    }),
  },
})
