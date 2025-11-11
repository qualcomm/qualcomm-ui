// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithRef, ReactElement} from "react"

import type {QdsCheckboxSize} from "@qualcomm-ui/qds-core/checkbox"
import type {DataAttributes} from "@qualcomm-ui/utils/attributes"

export interface CheckmarkCheckedIconProps
  extends ComponentPropsWithRef<"svg"> {
  size?: QdsCheckboxSize
}

const sharedProps: ComponentPropsWithRef<"svg"> & DataAttributes = {
  "data-part": "indicator-icon",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
}

export function CheckmarkCheckedIcon({
  size,
  ...props
}: CheckmarkCheckedIconProps): ReactElement {
  if (size === "sm") {
    return (
      <svg height="8" viewBox="0 0 10 8" width="10" {...sharedProps} {...props}>
        <path
          d="M3.74988 7.28125L0.624878 4.18294L1.61913 3.21875L3.74988 5.30975L8.38032 0.71875L9.37519 1.7045L3.74988 7.28125Z"
          fill="currentColor"
        />
      </svg>
    )
  }
  if (size === "lg") {
    return (
      <svg
        height="10"
        viewBox="0 0 12 10"
        width="12"
        {...sharedProps}
        {...props}
      >
        <path
          d="M4.46414 9.0312L0.624878 5.22472L1.84638 4.04016L4.46414 6.60908L10.1529 0.96875L11.3752 2.17981L4.46414 9.0312Z"
          fill="currentColor"
        />
      </svg>
    )
  }
  return (
    <svg height="8" viewBox="0 0 10 8" width="10" {...sharedProps} {...props}>
      <path
        d="M3.60701 7.65622L0.124878 4.20383L1.23275 3.12945L3.60701 5.45942L8.76662 0.34375L9.87519 1.44215L3.60701 7.65622Z"
        fill="currentColor"
      />
    </svg>
  )
}
