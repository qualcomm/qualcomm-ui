// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithoutRef, ReactElement} from "react"

import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {UpdatedOnDate} from "./updated-on-date"
import {useMdxDocsLayoutContext} from "./use-mdx-docs-layout"

export interface UpdatedOnProps extends ComponentPropsWithoutRef<"div"> {}

export function UpdatedOn({...props}: UpdatedOnProps): ReactElement | null {
  const docsLayoutData = useMdxDocsLayoutContext()
  const pageData = docsLayoutData?.pageMap?.[docsLayoutData.pathname]
  const updatedOn = pageData?.updatedOn
  const updatedBy = pageData?.updatedBy

  if (!updatedOn && !updatedBy) {
    return null
  }

  return (
    <div {...mergeProps({className: "qui-docs__updated-on-wrapper"}, props)}>
      <UpdatedOnDate />
      {updatedBy && (
        <span>
          {updatedOn ? " by " : "Updated by "}
          <span className="qui-docs__updated-by">{updatedBy}</span>
        </span>
      )}
    </div>
  )
}
