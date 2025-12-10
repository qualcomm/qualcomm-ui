import type {ReactNode} from "react"

export interface SchemaProps {
  children?: ReactNode
  description?: string
  title?: string
}

export function Schema({children, description, title}: SchemaProps) {
  return (
    <div className="openapi-schema">
      {title && <h4 className="openapi-schema__title">{title}</h4>}
      {description && (
        <p className="openapi-schema__description">{description}</p>
      )}
      {children && <div className="openapi-schema__content">{children}</div>}
    </div>
  )
}
