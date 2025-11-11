// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithRef, ReactElement} from "react"

import type {QdsCheckboxSize} from "@qualcomm-ui/qds-core/checkbox"
import type {DataAttributes} from "@qualcomm-ui/utils/attributes"

export interface CheckmarkIndeterminateIconProps
  extends ComponentPropsWithRef<"svg"> {
  size?: QdsCheckboxSize
}

const sharedProps: ComponentPropsWithRef<"svg"> & DataAttributes = {
  "data-part": "indicator-icon",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
}

export function CheckmarkIndeterminateIcon({
  size,
  ...props
}: CheckmarkIndeterminateIconProps): ReactElement {
  if (size === "sm") {
    return (
      <svg height="2" viewBox="0 0 8 2" width="8" {...sharedProps} {...props}>
        <path d="M8 2H0V0H8V2Z" fill="currentColor" />
      </svg>
    )
  }
  if (size === "lg") {
    return (
      <svg height="4" viewBox="0 0 10 4" width="10" {...sharedProps} {...props}>
        <path d="M10 3.5H0V0.5H10V3.5Z" fill="currentColor" />
      </svg>
    )
  }
  return (
    <svg height="2" viewBox="0 0 10 2" width="10" {...sharedProps} {...props}>
      <path d="M9.5 2H0.5V0H9.5V2Z" fill="currentColor" />
    </svg>
  )
}
