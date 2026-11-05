// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"

import type {QdsDialogSize} from "@qualcomm-ui/qds-core/dialog"
import {Button} from "@qualcomm-ui/react/button"
import {Dialog} from "@qualcomm-ui/react/dialog"

const FIGMA_URL_DEFAULT = "<FIGMA_COMPONENTS_BASE>?node-id=8157-32610"
const FIGMA_URL_FORM = "<FIGMA_COMPONENTS_BASE>?node-id=17824-6387"

const sharedProps = {
  closeButton: figma.boolean("dismiss", {
    true: <Dialog.CloseButton />,
  }),
  heading: figma.boolean("heading", {
    true: <Dialog.Heading>Heading</Dialog.Heading>,
  }),
  indicatorIcon: figma.boolean("icon", {
    true: <Dialog.IndicatorIcon />,
  }),
  size: figma.enum<QdsDialogSize>("size", {
    md: "md",
  }),
  slot: figma.boolean("slot", {
    true: "{/* Custom content goes here */}",
  }),
}

// _Dialog default (non-destructive)
figma.connect(Dialog.Root, FIGMA_URL_DEFAULT, {
  example: ({closeButton, footer, heading, indicatorIcon, size, slot}) => (
    <Dialog.Root defaultOpen size={size}>
      <Dialog.FloatingPortal>
        <Dialog.Body>
          {indicatorIcon}
          {closeButton}
          {heading}
          <Dialog.Description>Lorem Ipsum</Dialog.Description>
          {slot}
        </Dialog.Body>
        {footer}
      </Dialog.FloatingPortal>
    </Dialog.Root>
  ),
  props: {
    ...sharedProps,
    footer: figma.boolean("buttonGroup", {
      true: (
        <Dialog.Footer>
          <Dialog.CloseTrigger>
            <Button emphasis="neutral" variant="outline">
              Button
            </Button>
          </Dialog.CloseTrigger>
          <Dialog.CloseTrigger>
            <Button emphasis="primary">Button</Button>
          </Dialog.CloseTrigger>
        </Dialog.Footer>
      ),
    }),
  },
  variant: {
    destructive: false,
  },
})

// Destructive dialog - uses danger button for destructive actions.
figma.connect(Dialog.Root, FIGMA_URL_DEFAULT, {
  example: ({closeButton, footer, heading, indicatorIcon, size, slot}) => (
    // For destructive confirmations, consider adding role="alertdialog"
    // to improve accessibility for screen readers.
    <Dialog.Root defaultOpen size={size}>
      <Dialog.FloatingPortal>
        <Dialog.Body>
          {indicatorIcon}
          {closeButton}
          {heading}
          <Dialog.Description>Lorem Ipsum</Dialog.Description>
          {slot}
        </Dialog.Body>
        {footer}
      </Dialog.FloatingPortal>
    </Dialog.Root>
  ),
  props: {
    ...sharedProps,
    footer: figma.boolean("buttonGroup", {
      true: (
        <Dialog.Footer>
          <Dialog.CloseTrigger>
            <Button emphasis="neutral" variant="outline">
              Button
            </Button>
          </Dialog.CloseTrigger>
          <Dialog.CloseTrigger>
            <Button emphasis="danger">Button</Button>
          </Dialog.CloseTrigger>
        </Dialog.Footer>
      ),
    }),
  },
  variant: {
    destructive: true,
  },
})

// Form dialog - dialog with form content inside
figma.connect(Dialog.Root, FIGMA_URL_FORM, {
  example: ({closeButton, footer, heading, size}) => (
    <Dialog.Root defaultOpen size={size}>
      <Dialog.FloatingPortal>
        <Dialog.Body>
          {closeButton}
          {heading}
          <Dialog.Description>Lorem Ipsum</Dialog.Description>
          {/* Form content goes here */}
        </Dialog.Body>
        {footer}
      </Dialog.FloatingPortal>
    </Dialog.Root>
  ),
  props: {
    closeButton: figma.boolean("dismiss", {
      true: <Dialog.CloseButton />,
    }),
    footer: figma.boolean("buttonGroup", {
      true: (
        <Dialog.Footer>
          <Dialog.CloseTrigger>
            <Button emphasis="neutral" variant="outline">
              Button
            </Button>
          </Dialog.CloseTrigger>
          <Dialog.CloseTrigger>
            <Button emphasis="primary">Button</Button>
          </Dialog.CloseTrigger>
        </Dialog.Footer>
      ),
    }),
    heading: figma.boolean("heading", {
      true: <Dialog.Heading>Heading</Dialog.Heading>,
    }),
    size: figma.enum<QdsDialogSize>("size", {
      md: "md",
    }),
  },
})
