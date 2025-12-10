import type {ReactNode} from "react"

export interface BadgeProps {
  children: ReactNode
  variant?: "default" | "deprecated" | "required" | "optional"
}

export function Badge({children, variant = "default"}: BadgeProps) {
  return (
    <span className="openapi-badge" data-variant={variant}>
      {children}
    </span>
  )
}
