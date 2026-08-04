// @ts-nocheck

// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"

import {AlertBanner} from "@qualcomm-ui/react/alert-banner"

const FIGMA_URL = "<FIGMA_COMPONENTS_BASE>?node-id=3566-16209"

const sharedProps = {
  description: figma.boolean("description", {
    true: figma.string("descriptionText"),
  }),
  emphasis: figma.enum("emphasis", {
    danger: "danger",
    neutral: "neutral",
    success: "success",
    warning: "warning",
  }),
  heading: figma.string("heading"),
}

// Strong variant with icon (simple API)
figma.connect(AlertBanner, FIGMA_URL, {
  example: (props) => <AlertBanner {...props} />,
  props: {
    ...sharedProps,
    action: figma.boolean("button", {
      true: <AlertBanner.Button>Button</AlertBanner.Button>,
    }),
    dismissable: figma.boolean("dismiss"),
  },
  variant: {showIcon: true, variant: "strong"},
})

// Strong variant without icon (composite API)
figma.connect(AlertBanner.Root, FIGMA_URL, {
  example: ({action, description, dismissButton, emphasis, heading}) => (
    <AlertBanner.Root emphasis={emphasis}>
      <AlertBanner.Heading>{heading}</AlertBanner.Heading>
      <AlertBanner.Description>{description}</AlertBanner.Description>
      <AlertBanner.ActionContainer>{action}</AlertBanner.ActionContainer>
      {dismissButton}
    </AlertBanner.Root>
  ),
  props: {
    ...sharedProps,
    action: figma.boolean("button", {
      true: <AlertBanner.Button>Button</AlertBanner.Button>,
    }),
    dismissButton: figma.boolean("dismiss", {
      true: <AlertBanner.CloseButton />,
    }),
  },
  variant: {showIcon: false, variant: "strong"},
})

// Subtle variant with icon (simple API)
figma.connect(AlertBanner, FIGMA_URL, {
  example: (props) => <AlertBanner {...props} />,
  props: {
    ...sharedProps,
    action: figma.boolean("button", {
      true: <AlertBanner.Button>Button</AlertBanner.Button>,
    }),
    dismissable: figma.boolean("dismiss"),
    variant: "subtle",
  },
  variant: {showIcon: true, variant: "subtle"},
})

// Subtle variant without icon (composite API)
figma.connect(AlertBanner.Root, FIGMA_URL, {
  example: ({action, description, dismissButton, emphasis, heading}) => (
    <AlertBanner.Root emphasis={emphasis} variant="subtle">
      <AlertBanner.Heading>{heading}</AlertBanner.Heading>
      <AlertBanner.Description>{description}</AlertBanner.Description>
      <AlertBanner.ActionContainer>{action}</AlertBanner.ActionContainer>
      {dismissButton}
    </AlertBanner.Root>
  ),
  props: {
    ...sharedProps,
    action: figma.boolean("button", {
      true: <AlertBanner.Button>Button</AlertBanner.Button>,
    }),
    dismissButton: figma.boolean("dismiss", {
      true: <AlertBanner.CloseButton />,
    }),
    variant: "subtle",
  },
  variant: {showIcon: false, variant: "subtle"},
})
