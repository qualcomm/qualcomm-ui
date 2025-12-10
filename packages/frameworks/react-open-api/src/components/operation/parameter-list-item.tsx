import {useMemo, useState} from "react"

import type {ParameterObject, SchemaObject} from "../../types"
import {SchemaProperty} from "../schema"

export interface ParameterListItemProps {
  breadcrumb?: string[]
  collapsable?: boolean
  name: string
  parameter: ParameterObject
  withExamples?: boolean
}

export function ParameterListItem({
  breadcrumb,
  collapsable = false,
  name,
  parameter,
  withExamples = true,
}: ParameterListItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  const schema = useMemo(() => parameter.schema || null, [parameter])

  const value = useMemo(() => {
    const deprecated = parameter.deprecated || schema?.deprecated
    const paramExamples = parameter.examples || {}
    const schemaExamples = schema?.examples || []

    return {
      ...schema,
      deprecated,
      ...(parameter.example !== undefined && {example: parameter.example}),
      examples: [...Object.values(paramExamples), ...schemaExamples],
    } as SchemaObject
  }, [parameter, schema])

  const shouldCollapse = collapsable && schema

  if (shouldCollapse) {
    return (
      <li className="openapi-parameter-item">
        <button
          className="openapi-parameter-item__trigger"
          data-open={isOpen || undefined}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="openapi-parameter-item__name">
            <CaretIcon open={isOpen} />
            <span>{name}</span>
          </div>
          {!isOpen && parameter.description && (
            <span className="openapi-parameter-item__summary">
              {parameter.description}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="openapi-parameter-item__content">
            {parameter.description && (
              <p className="openapi-parameter-item__description">
                {parameter.description}
              </p>
            )}
            <SchemaProperty
              name=""
              schema={value}
              breadcrumb={breadcrumb}
              compact
              hideHeading
              required={parameter.required}
            />
          </div>
        )}
      </li>
    )
  }

  return (
    <li className="openapi-parameter-item">
      <div className="openapi-parameter-item__content">
        <SchemaProperty
          name={name}
          schema={value}
          breadcrumb={breadcrumb}
          compact
          required={parameter.required}
        >
          {parameter.description && (
            <p className="openapi-parameter-item__description">
              {parameter.description}
            </p>
          )}
        </SchemaProperty>
      </div>
    </li>
  )
}

function CaretIcon({open}: {open: boolean}) {
  return (
    <svg
      className="openapi-parameter-item__caret"
      data-open={open || undefined}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}
