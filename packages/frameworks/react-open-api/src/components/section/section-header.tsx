import type {ReactNode} from "react"

export interface SectionHeaderProps {
  children?: ReactNode
  links?: ReactNode
  loading?: boolean
  tight?: boolean
}

export function SectionHeader({
  children,
  links,
  loading = false,
  tight = false,
}: SectionHeaderProps) {
  if (loading) {
    return (
      <div className="openapi-section-header-wrapper">
        <div className="openapi-section-header__skeleton" />
      </div>
    )
  }

  return (
    <div className="openapi-section-header-wrapper">
      <div className="openapi-section-header" data-tight={tight || undefined}>
        {children}
      </div>
      {links && <div className="openapi-section-header__links">{links}</div>}
    </div>
  )
}
