// @ts-nocheck
import type {ReactNode} from "react"

export interface CardProps {
  children: ReactNode
}

export function Card({children}: CardProps) {
  return <div className="card">{children}</div>
}
