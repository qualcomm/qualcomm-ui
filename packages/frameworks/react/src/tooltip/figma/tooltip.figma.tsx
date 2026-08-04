// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"

import type {Placement} from "@qualcomm-ui/dom/floating-ui"
import {Button} from "@qualcomm-ui/react/button"
import {Tooltip} from "@qualcomm-ui/react/tooltip"

figma.connect(Tooltip, "<FIGMA_COMPONENTS_BASE>?node-id=2288-3939", {
  example: (props) => {
    return (
      <Tooltip
        positioning={{placement: props.placement}}
        trigger={<Button emphasis="primary">Label</Button>}
      >
        {props.text}
      </Tooltip>
    )
  },
  props: {
    placement: figma.enum<Placement>("placement", {
      bottom: "bottom",
      "bottom-left": "bottom-start",
      "bottom-right": "bottom-end",
      left: "left",
      right: "right",
      top: "top",
      "top-left": "top-start",
      "top-right": "top-end",
    }),
    text: figma.string("text"),
  },
})
