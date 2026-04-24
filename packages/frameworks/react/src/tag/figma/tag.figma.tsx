// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"
import {Star} from "lucide-react"

import type {
  QdsTagEmphasis,
  QdsTagRadius,
  QdsTagSize,
} from "@qualcomm-ui/qds-core/tag"
import {Tag} from "@qualcomm-ui/react/tag"

const sharedProps = {
  disabled: figma.enum("state", {
    disabled: true,
  }),
  emphasis: figma.enum<QdsTagEmphasis>("emphasis", {
    blue: "blue",
    cyan: "cyan",
    green: "green",
    lime: "lime",
    magenta: "magenta",
    neutral: "neutral",
    orange: "orange",
    "outline-neutral": "outline-neutral",
    purple: "purple",
    red: "red",
    teal: "teal",
    yellow: "yellow",
  }),
  endIcon: figma.boolean("endIcon", {
    false: undefined,
    true: Star,
  }),
  label: figma.string("label"),
  radius: figma.enum<QdsTagRadius>("radius", {
    rounded: "rounded",
  }),
  size: figma.enum<QdsTagSize>("size", {
    lg: "lg",
    sm: "sm",
  }),
  startIcon: figma.boolean("startIcon", {
    false: undefined,
    true: Star,
  }),
}

// General Tag - Read Only variant
figma.connect(Tag, "<FIGMA_COMPONENTS_BASE>?node-id=17020-4041", {
  example: ({nested}) => (
    <Tag
      disabled={nested.disabled}
      emphasis={nested.emphasis}
      endIcon={nested.endIcon}
      radius={nested.radius}
      size={nested.size}
      startIcon={nested.startIcon}
    >
      {nested.label}
    </Tag>
  ),
  props: {
    nested: figma.nestedProps("Tag read only options", {
      disabled: figma.enum("state", {
        disabled: true,
      }),
      emphasis: figma.enum<QdsTagEmphasis>("emphasis", {
        blue: "blue",
        cyan: "cyan",
        green: "green",
        lime: "lime",
        magenta: "magenta",
        neutral: "neutral",
        orange: "orange",
        "outline-neutral": "outline-neutral",
        purple: "purple",
        red: "red",
        teal: "teal",
        yellow: "yellow",
      }),
      endIcon: figma.boolean("endIcon", {
        false: undefined,
        true: Star,
      }),
      label: figma.string("label"),
      radius: figma.enum<QdsTagRadius>("radius", {
        rounded: "rounded",
      }),
      size: figma.enum<QdsTagSize>("size", {
        lg: "lg",
        sm: "sm",
      }),
      startIcon: figma.boolean("startIcon", {
        false: undefined,
        true: Star,
      }),
    }),
  },
  variant: {variant: "read-only"},
})

// General Tag - Link variant
figma.connect(Tag, "<FIGMA_COMPONENTS_BASE>?node-id=17020-4041", {
  example: ({nested}) => (
    <Tag
      disabled={nested.disabled}
      emphasis={nested.emphasis}
      endIcon={nested.endIcon}
      radius={nested.radius}
      size={nested.size}
      startIcon={nested.startIcon}
      variant="link"
    >
      {nested.label}
    </Tag>
  ),
  props: {
    nested: figma.nestedProps("Tag link options", {
      disabled: figma.enum("state", {
        disabled: true,
      }),
      emphasis: figma.enum<QdsTagEmphasis>("emphasis", {
        blue: "blue",
        cyan: "cyan",
        green: "green",
        lime: "lime",
        magenta: "magenta",
        neutral: "neutral",
        orange: "orange",
        "outline-neutral": "outline-neutral",
        purple: "purple",
        red: "red",
        teal: "teal",
        yellow: "yellow",
      }),
      endIcon: figma.boolean("endIcon", {
        false: undefined,
        true: Star,
      }),
      label: figma.string("label"),
      radius: figma.enum<QdsTagRadius>("radius", {
        rounded: "rounded",
      }),
      size: figma.enum<QdsTagSize>("size", {
        lg: "lg",
        sm: "sm",
      }),
      startIcon: figma.boolean("startIcon", {
        false: undefined,
        true: Star,
      }),
    }),
  },
  variant: {variant: "link"},
})

// General Tag - Selectable variant
figma.connect(Tag, "<FIGMA_COMPONENTS_BASE>?node-id=17020-4041", {
  example: ({nested}) => (
    <Tag
      disabled={nested.disabled}
      emphasis={nested.emphasis}
      endIcon={nested.endIcon}
      radius={nested.radius}
      size={nested.size}
      startIcon={nested.startIcon}
      variant="selectable"
    >
      {nested.label}
    </Tag>
  ),
  props: {
    nested: figma.nestedProps("Tag selectable options", {
      disabled: figma.enum("state", {
        disabled: true,
      }),
      emphasis: figma.enum<QdsTagEmphasis>("emphasis", {
        blue: "blue",
        cyan: "cyan",
        green: "green",
        lime: "lime",
        magenta: "magenta",
        neutral: "neutral",
        orange: "orange",
        "outline-neutral": "outline-neutral",
        purple: "purple",
        red: "red",
        teal: "teal",
        yellow: "yellow",
      }),
      endIcon: figma.boolean("endIcon", {
        false: undefined,
        true: Star,
      }),
      label: figma.string("label"),
      radius: figma.enum<QdsTagRadius>("radius", {
        rounded: "rounded",
      }),
      size: figma.enum<QdsTagSize>("size", {
        lg: "lg",
        sm: "sm",
      }),
      startIcon: figma.boolean("startIcon", {
        false: undefined,
        true: Star,
      }),
    }),
  },
  variant: {variant: "selectable"},
})

// General Tag - Dismissible variant
figma.connect(Tag, "<FIGMA_COMPONENTS_BASE>?node-id=17020-4041", {
  example: ({nested}) => (
    <Tag
      disabled={nested.disabled}
      emphasis={nested.emphasis}
      radius={nested.radius}
      size={nested.size}
      startIcon={nested.startIcon}
      variant="dismissable"
    >
      {nested.label}
    </Tag>
  ),
  props: {
    nested: figma.nestedProps("Tag dismissible options", {
      disabled: figma.enum("state", {
        disabled: true,
      }),
      emphasis: figma.enum<QdsTagEmphasis>("emphasis", {
        blue: "blue",
        cyan: "cyan",
        green: "green",
        lime: "lime",
        magenta: "magenta",
        neutral: "neutral",
        orange: "orange",
        "outline-neutral": "outline-neutral",
        purple: "purple",
        red: "red",
        teal: "teal",
        yellow: "yellow",
      }),
      label: figma.string("label"),
      radius: figma.enum<QdsTagRadius>("radius", {
        rounded: "rounded",
      }),
      size: figma.enum<QdsTagSize>("size", {
        lg: "lg",
        sm: "sm",
      }),
      startIcon: figma.boolean("icon", {
        false: undefined,
        true: Star,
      }),
    }),
  },
  variant: {variant: "dismissible"},
})

// Link Tag
figma.connect(Tag, "<FIGMA_COMPONENTS_BASE>?node-id=16776-17872", {
  example: ({disabled, emphasis, endIcon, label, radius, size, startIcon}) => (
    <Tag
      disabled={disabled}
      emphasis={emphasis}
      endIcon={endIcon}
      radius={radius}
      size={size}
      startIcon={startIcon}
      variant="link"
    >
      {label}
    </Tag>
  ),
  props: sharedProps,
})

// Selectable Tag
figma.connect(Tag, "<FIGMA_COMPONENTS_BASE>?node-id=16835-3076", {
  example: ({disabled, emphasis, endIcon, label, radius, size, startIcon}) => (
    <Tag
      disabled={disabled}
      emphasis={emphasis}
      endIcon={endIcon}
      radius={radius}
      size={size}
      startIcon={startIcon}
      variant="selectable"
    >
      {label}
    </Tag>
  ),
  props: sharedProps,
})

// Dismissible Tag
figma.connect(Tag, "<FIGMA_COMPONENTS_BASE>?node-id=16928-3307", {
  example: ({disabled, emphasis, label, radius, size, startIcon}) => (
    <Tag
      disabled={disabled}
      emphasis={emphasis}
      radius={radius}
      size={size}
      startIcon={startIcon}
      variant="dismissable"
    >
      {label}
    </Tag>
  ),
  props: {
    disabled: figma.enum("state", {
      disabled: true,
    }),
    emphasis: figma.enum<QdsTagEmphasis>("emphasis", {
      amber: "amber",
      blue: "blue",
      cyan: "cyan",
      green: "green",
      lime: "lime",
      magenta: "magenta",
      neutral: "neutral",
      orange: "orange",
      "outline-neutral": "outline-neutral",
      purple: "purple",
      red: "red",
      teal: "teal",
      violet: "violet",
      yellow: "yellow",
    }),
    label: figma.string("label"),
    radius: figma.enum<QdsTagRadius>("radius", {
      rounded: "rounded",
    }),
    size: figma.enum<QdsTagSize>("size", {
      lg: "lg",
      sm: "sm",
    }),
    startIcon: figma.boolean("icon", {
      false: undefined,
      true: Star,
    }),
  },
})

// Read Only Tag
figma.connect(Tag, "<FIGMA_COMPONENTS_BASE>?node-id=16762-2131", {
  example: ({disabled, emphasis, endIcon, label, radius, size, startIcon}) => (
    <Tag
      disabled={disabled}
      emphasis={emphasis}
      endIcon={endIcon}
      radius={radius}
      size={size}
      startIcon={startIcon}
    >
      {label}
    </Tag>
  ),
  props: sharedProps,
})
