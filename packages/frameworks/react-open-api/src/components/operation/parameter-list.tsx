import {type ReactNode, useId, useMemo} from "react"

import type {ParameterObject} from "../../types"

import {ParameterListItem} from "./parameter-list-item"

export interface ParameterListProps {
  breadcrumb?: string[]
  collapsable?: boolean
  parameters: ParameterObject[]
  title?: ReactNode
  withExamples?: boolean
}

function shouldIgnoreParameter(parameter: ParameterObject): boolean {
  // x-internal is a common extension to mark internal-only parameters
  return Boolean((parameter as Record<string, unknown>)["x-internal"])
}

export function ParameterList({
  breadcrumb,
  collapsable = false,
  parameters,
  title,
  withExamples = true,
}: ParameterListProps) {
  const id = useId()

  const filteredParameters = useMemo(
    () => parameters.filter((p) => !shouldIgnoreParameter(p)),
    [parameters],
  )

  if (filteredParameters.length === 0) {
    return null
  }

  return (
    <div className="openapi-parameter-list">
      {title && (
        <div id={id} className="openapi-parameter-list__title">
          {title}
        </div>
      )}
      <ul className="openapi-parameter-list__items" aria-labelledby={id}>
        {filteredParameters.map((item) => (
          <ParameterListItem
            key={item.name ?? "unknown"}
            name={item.name ?? ""}
            parameter={item}
            breadcrumb={breadcrumb}
            collapsable={collapsable}
            withExamples={withExamples}
          />
        ))}
      </ul>
    </div>
  )
}
