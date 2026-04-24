import type {ReactNode} from "react"

export interface CardHeaderProps {
  children: ReactNode
}

export function CardHeader({children}: CardHeaderProps) {
  return <header className="card-header">{children}</header>
}
