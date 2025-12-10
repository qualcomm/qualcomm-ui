import type {ReactNode} from "react"

export interface SectionColumnsProps {
  children?: ReactNode
}

export function SectionColumns({children}: SectionColumnsProps) {
  return <div className="openapi-section-columns">{children}</div>
}
