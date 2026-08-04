// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"

import type {
  QdsBadgeBasicSize,
  QdsBadgeCategoryEmphasis,
  QdsBadgeExtraSize,
  QdsBadgeSemanticEmphasis,
  QdsNumberBadgeEmphasis,
  QdsStatusBadgeVariant,
  QdsTextBadgeVariant,
} from "@qualcomm-ui/qds-core/badge"
import {Badge, NumberBadge, StatusBadge} from "@qualcomm-ui/react/badge"

// IconBadge is mapped via the raw template in ./icon-badge.figma.js

// Number Badge (Badge count in Figma)
figma.connect(NumberBadge, "<FIGMA_COMPONENTS_BASE>?node-id=13390-5460", {
  example: ({disabled, emphasis, size, value}) => (
    <NumberBadge
      disabled={disabled}
      emphasis={emphasis}
      size={size}
      value={value}
    />
  ),
  props: {
    disabled: figma.enum("disabled", {
      yes: true,
    }),
    emphasis: figma.enum<QdsNumberBadgeEmphasis>("emphasis", {
      brand: "brand",
      "brand-outline": "brand-outline",
      danger: "danger",
      info: "info",
      neutral: "neutral",
      "neutral-outline": "neutral-outline",
      "persistent-black": "persistent-black",
      "persistent-white": "persistent-white",
      success: "success",
      warning: "warning",
    }),
    size: figma.enum<QdsBadgeBasicSize>("size", {
      lg: "lg",
      sm: "sm",
    }),
    value: figma.string("label"),
  },
})

// Status Badge
figma.connect(StatusBadge, "<FIGMA_COMPONENTS_BASE>?node-id=13426-472", {
  example: ({disabled, emphasis, size, variant}) => (
    <StatusBadge
      disabled={disabled}
      emphasis={emphasis}
      size={size}
      variant={variant}
    />
  ),
  props: {
    disabled: figma.enum("disabled", {
      yes: true,
    }),
    emphasis: figma.enum<QdsBadgeSemanticEmphasis>("emphasis", {
      brand: "brand",
      danger: "danger",
      info: "info",
      neutral: "neutral",
      success: "success",
      warning: "warning",
    }),
    size: figma.enum<QdsBadgeExtraSize>("size", {
      lg: "lg",
      sm: "sm",
      xl: "xl",
      xs: "xs",
    }),
    variant: figma.enum<QdsStatusBadgeVariant>("variant", {
      filled: "filled",
      outline: "outlined",
    }),
  },
})

// Text Badge (Badge in code)
figma.connect(Badge, "<FIGMA_COMPONENTS_BASE>?node-id=14305-13751", {
  example: ({children, disabled, emphasis, size, variant}) => (
    <Badge
      disabled={disabled}
      emphasis={emphasis}
      size={size}
      variant={variant}
    >
      {children}
    </Badge>
  ),
  props: {
    children: figma.string("label"),
    disabled: figma.enum("disabled", {
      yes: true,
    }),
    emphasis: figma.enum<QdsBadgeSemanticEmphasis | QdsBadgeCategoryEmphasis>(
      "emphasis",
      {
        amber: "amber",
        blue: "blue",
        brand: "brand",
        cyan: "cyan",
        danger: "danger",
        green: "green",
        info: "info",
        lime: "lime",
        magenta: "magenta",
        neutral: "neutral",
        orange: "orange",
        purple: "purple",
        red: "red",
        success: "success",
        teal: "teal",
        violet: "violet",
        warning: "warning",
        yellow: "yellow",
      },
    ),
    size: figma.enum<QdsBadgeBasicSize>("size", {
      lg: "lg",
      sm: "sm",
    }),
    variant: figma.enum<QdsTextBadgeVariant>("variant", {
      Default: "default",
      subtle: "subtle",
    }),
  },
})
