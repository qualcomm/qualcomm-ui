// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {ChevronRight} from "lucide-react"

import {Collapsible} from "@qualcomm-ui/react/collapsible"
import {Icon} from "@qualcomm-ui/react/icon"

export interface FieldRowProps {
  /**
   * Shown next to the header, outside the trigger, e.g. a media type picker.
   */
  accessory?: ReactNode
  /**
   * Collapsed content. The row expands only when this is set.
   */
  children?: ReactNode
  /**
   * Always visible below the header, e.g. the description.
   */
  details?: ReactNode
  /**
   * The trigger when the row expands.
   */
  header: ReactNode
}

/**
 * One row of a field list: a property, a response...
 */
export function FieldRow({
  accessory,
  children,
  details,
  header,
}: FieldRowProps): ReactNode {
  if (!children) {
    return (
      <div className="qui-docs-openapi__field">
        <div className="qui-docs-openapi__field-row">
          <div className="qui-docs-openapi__field-header">{header}</div>
          {accessory}
        </div>
        {details}
      </div>
    )
  }
  return (
    <Collapsible.Root className="qui-docs-openapi__field" lazyMount>
      <div className="qui-docs-openapi__field-row">
        <Collapsible.Trigger className="qui-docs-openapi__field-header">
          <Icon
            className="qui-docs-openapi__field-indicator"
            icon={ChevronRight}
          />
          {header}
        </Collapsible.Trigger>
        {accessory}
      </div>
      {details}
      <Collapsible.Content className="qui-docs-openapi__field-children">
        {children}
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
