import type {ReactNode} from "react"

export interface OperationsListProps {
  children: ReactNode
  title?: string
}

export function OperationsList({children, title}: OperationsListProps) {
  return (
    <nav className="openapi-operations-list" aria-label={title || "Operations"}>
      {title && <h3 className="openapi-operations-list__title">{title}</h3>}
      <ul className="openapi-operations-list__items">{children}</ul>
    </nav>
  )
}
