// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"

import {Slider} from "@qualcomm-ui/react/slider"

const sharedProps = {
  disabled: figma.enum("state", {
    disabled: true,
  }),
  emphasis: figma.enum("emphasis", {
    neutral: "neutral",
  }),
  errorText: figma.string("errorText"),
  hint: figma.boolean("hint", {
    true: figma.string("hintText"),
  }),
  invalid: figma.enum("state", {
    invalid: true,
  }),
  label: figma.boolean("label", {
    true: figma.string("labelText"),
  }),
  sideMarkers: figma.enum("valuePosition", {
    side: true,
  }),
  size: figma.enum("size", {
    sm: "sm",
  }),
}

figma.connect(Slider, "<FIGMA_COMPONENTS_BASE>?node-id=6427-386", {
  example: ({defaultValue, hint, label, ...props}) => (
    <Slider defaultValue={defaultValue} hint={hint} label={label} {...props} />
  ),
  props: {
    ...sharedProps,
    defaultValue: figma.enum("variant", {
      range: [25, 75],
      single: [25],
    }),
  },
})
