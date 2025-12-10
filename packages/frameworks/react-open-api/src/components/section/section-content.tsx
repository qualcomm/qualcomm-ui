import type {ReactNode} from "react"

export interface SectionContentProps {
  children?: ReactNode
  loading?: boolean
}

export function SectionContent({
  children,
  loading = false,
}: SectionContentProps) {
  if (loading) {
    return (
      <div className="openapi-section-content">
        <div className="openapi-section-content__skeleton" />
      </div>
    )
  }

  return <div className="openapi-section-content">{children}</div>
}
