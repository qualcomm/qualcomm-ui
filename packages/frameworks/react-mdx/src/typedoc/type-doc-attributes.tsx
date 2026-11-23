// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useCallback} from "react"

import {ChevronRight} from "lucide-react"

import type {PagePropType} from "@qualcomm-ui/mdx-common"
import {Collapsible} from "@qualcomm-ui/react/collapsible"
import {Icon} from "@qualcomm-ui/react/icon"

import {TypeDocProps, type TypeDocPropsProps} from "./type-doc-props.js"
import type {ColumnNames} from "./use-typedoc-context.js"

export interface TypeDocAttributesProps extends Omit<
  TypeDocPropsProps,
  | "columnNames"
  | "partial"
  | "hideDefaultColumn"
  | "showComponentJsdoc"
  | "sortRequiredPropsFirst"
> {}

const cols: ColumnNames = {
  description: "Description",
  name: "Attribute / Property",
  type: "Value",
}

const whitelisted = new Set(["className", "hidden", "style", "tabIndex"])

const propFilter: TypeDocPropsProps["propFilter"] = (prop) => {
  return prop.name.startsWith("data-") || whitelisted.has(prop.name)
}

/**
 * `BooleanDataAttr` is `'' | undefined` so that the attribute is omitted when
 * the condition is false. Readers only need to know that it is a boolean
 * attribute: present when true, absent when false.
 */
function printBooleanDataAttr(prop: PagePropType): PagePropType {
  if (prop.resolvedType?.name !== "BooleanDataAttr") {
    return prop
  }
  return {
    ...prop,
    resolvedType: {
      ...prop.resolvedType,
      prettyType: "boolean",
      type: "boolean",
    },
  }
}

/**
 * Used for displaying the data-* and className attributes of a reusable UI
 * component.
 */
export function TypeDocAttributes({
  propTransformer,
  ...props
}: TypeDocAttributesProps): ReactElement {
  const transformProp = useCallback(
    (prop: PagePropType) => {
      const printed = printBooleanDataAttr(prop)
      return propTransformer ? propTransformer(printed) : printed
    },
    [propTransformer],
  )

  return (
    <Collapsible.Root className="mdx-spoiler__root">
      <Collapsible.Trigger className="mdx-spoiler__trigger">
        Attributes
        <Icon className="mdx-spoiler__indicator" icon={ChevronRight} />
      </Collapsible.Trigger>
      <Collapsible.Content className="mdx-spoiler__content">
        <div className="mdx-spoiler__content-body">
          <TypeDocProps
            columnNames={cols}
            hideDefaultColumn
            linkifyPrimaryColumn={false}
            partial
            propFilter={propFilter}
            propTransformer={transformProp}
            showComponentJsdoc={false}
            sortRequiredPropsFirst={false}
            {...props}
          />
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
