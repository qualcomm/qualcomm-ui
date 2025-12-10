import type {ReactNode} from "react"

import {Section, SectionContent, SectionHeader} from "../section"

export interface TagProps {
  children?: ReactNode
  collapsed?: boolean
  description?: string
  id?: string
  layout?: "modern" | "classic"
  name: string
}

export function Tag({
  children,
  collapsed = false,
  description,
  id,
  layout = "modern",
  name,
}: TagProps) {
  return (
    <Section id={id}>
      <div
        className="openapi-tag"
        data-layout={layout}
        data-collapsed={collapsed || undefined}
      >
        <SectionHeader>
          <h2 className="openapi-tag__name">{name}</h2>
        </SectionHeader>

        {description && (
          <p className="openapi-tag__description">{description}</p>
        )}

        {children && (
          <SectionContent>
            <div className="openapi-tag__operations">{children}</div>
          </SectionContent>
        )}
      </div>
    </Section>
  )
}
