import type {ReactNode} from "react"

export interface SchemaPropertyDetailProps {
  children: ReactNode
  code?: boolean
  prefix?: ReactNode
  truncate?: boolean
}

export function SchemaPropertyDetail({
  children,
  code,
  prefix,
  truncate,
}: SchemaPropertyDetailProps) {
  const content = code ? (
    <code className="openapi-schema-property-detail__value openapi-schema-property-detail__value--code">
      {children}
    </code>
  ) : (
    <span className="openapi-schema-property-detail__value">{children}</span>
  )

  return (
    <span
      className="openapi-schema-property-detail"
      data-truncate={truncate || undefined}
    >
      {prefix && (
        <span className="openapi-schema-property-detail__prefix">
          {prefix}&nbsp;
        </span>
      )}
      {content}
    </span>
  )
}
