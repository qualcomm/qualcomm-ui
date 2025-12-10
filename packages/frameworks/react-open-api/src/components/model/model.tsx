import {useState} from "react"

import type {SchemaObject} from "../../types"
import {Schema} from "../schema"
import {Section, SectionContent, SectionHeader} from "../section"

export interface ModelProps {
  collapsed?: boolean
  id?: string
  layout?: "modern" | "classic"
  name: string
  onIntersecting?: () => void
  schema?: SchemaObject
}

export function Model({
  collapsed: initialCollapsed = false,
  id,
  layout = "modern",
  name,
  onIntersecting,
  schema,
}: ModelProps) {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed)

  if (!schema) {
    return null
  }

  return (
    <Section id={id} onIntersecting={onIntersecting}>
      <div className="openapi-model" data-layout={layout}>
        <SectionHeader>
          <button
            className="openapi-model__header"
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-expanded={!isCollapsed}
          >
            <CaretIcon open={!isCollapsed} />
            <h3 className="openapi-model__name">{name}</h3>
            {schema.type && (
              <span className="openapi-model__type">
                {Array.isArray(schema.type)
                  ? schema.type.join(" | ")
                  : schema.type}
              </span>
            )}
          </button>
        </SectionHeader>

        {!isCollapsed && (
          <SectionContent>
            {schema.description && (
              <p className="openapi-model__description">{schema.description}</p>
            )}

            <div className="openapi-model__schema">
              <Schema>
                <pre className="openapi-model__code">
                  {JSON.stringify(schema, null, 2)}
                </pre>
              </Schema>
            </div>
          </SectionContent>
        )}
      </div>
    </Section>
  )
}

function CaretIcon({open}: {open: boolean}) {
  return (
    <svg
      className="openapi-model__caret"
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
