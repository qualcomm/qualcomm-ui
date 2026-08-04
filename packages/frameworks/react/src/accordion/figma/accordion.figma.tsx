// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"

import type {QdsAccordionSize} from "@qualcomm-ui/qds-core/accordion"
import {Accordion} from "@qualcomm-ui/react/accordion"

// Accordion Item is mapped via the raw template in ./accordion-item.figma.js

figma.connect(Accordion.Root, "<FIGMA_COMPONENTS_BASE>?node-id=2191-5476", {
  example: ({children, size, uncontained}) => {
    return (
      <Accordion.Root size={size} uncontained={uncontained}>
        {children}
      </Accordion.Root>
    )
  },
  props: {
    children: figma.children("Accordion"),
    size: figma.enum<QdsAccordionSize>("size", {
      lg: "lg",
      sm: "sm",
    }),
    uncontained: figma.enum("contained", {
      false: true,
    }),
  },
})
