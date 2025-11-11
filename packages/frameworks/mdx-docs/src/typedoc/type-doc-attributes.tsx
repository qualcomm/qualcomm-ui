import type {ReactElement} from "react"

import {ChevronRight} from "lucide-react"

import {Collapsible} from "@qualcomm-ui/react/collapsible"
import {Icon} from "@qualcomm-ui/react/icon"

import {TypeDocProps, type TypeDocPropsProps} from "./type-doc-props"
import type {ColumnNames} from "./use-typedoc-context"

export interface TypeDocAttributesProps
  extends Omit<
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
 * Used for displaying the data-* and className attributes of a reusable UI
 * component.
 */
export function TypeDocAttributes(props: TypeDocAttributesProps): ReactElement {
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
            showComponentJsdoc={false}
            sortRequiredPropsFirst={false}
            {...props}
          />
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
