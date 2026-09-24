// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithoutRef, ReactElement} from "react"

import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useMdxDocsLayoutContext} from "./use-mdx-docs-layout.js"

export interface UpdatedOnDateProps extends ComponentPropsWithoutRef<"span"> {}

export function UpdatedOnDate({
  ...props
}: UpdatedOnDateProps): ReactElement | null {
  const docsLayoutData = useMdxDocsLayoutContext()
  const pageData = docsLayoutData?.pageMap?.[docsLayoutData.pathname]
  const updatedOn = pageData?.updatedOn

  if (!updatedOn) {
    return null
  }

  return (
    <span {...mergeProps({className: "qui-docs__updated-on-date"}, props)}>
      Last updated on{" "}
      <time className="qui-docs__updated-on-time">
        {new Date(updatedOn).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          timeZone: "UTC",
          year: "numeric",
        })}
      </time>
    </span>
  )
}
