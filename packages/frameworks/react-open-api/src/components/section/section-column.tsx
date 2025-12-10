import type {ReactNode} from "react"

export interface SectionColumnProps {
  children?: ReactNode
}

export function SectionColumn({children}: SectionColumnProps) {
  return <div className="openapi-section-column">{children}</div>
}
