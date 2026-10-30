// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithRef, ReactElement} from "react"

import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface StepsProps extends ComponentPropsWithRef<"div"> {}

export function HeadingSteps({...props}: StepsProps): ReactElement {
  const mergedProps = mergeProps(
    {className: "qui-docs__steps-container"},
    props,
  )

  return (
    <div className="qui-docs__steps-root">
      <div className="qui-docs__step-indent-guide"></div>
      <div {...mergedProps}></div>
    </div>
  )
}
