import type {ReactNode} from "react"

export interface SectionContainerProps {
  children?: ReactNode
  /** Skips rendering the container div, rendering only the children directly */
  omit?: boolean
}

export function SectionContainer({children, omit}: SectionContainerProps) {
  if (omit) {
    return <>{children}</>
  }

  return <div className="openapi-section-container">{children}</div>
}
