import {useOpenApiContext} from "../../context"
import {HttpMethod} from "../http-method"

export interface OperationsListItemProps {
  deprecated?: boolean
  href?: string
  id: string
  isActive?: boolean
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD"
  path: string
  summary?: string
}

export function OperationsListItem({
  deprecated,
  href,
  id,
  isActive,
  method,
  path,
  summary,
}: OperationsListItemProps) {
  const {pathname, renderLink: RenderLink} = useOpenApiContext()
  const linkHref = href || `#${id}`
  const active = isActive ?? pathname === linkHref

  return (
    <li className="openapi-operations-list-item">
      <RenderLink
        href={linkHref}
        className="openapi-operations-list-item__link"
        data-active={active || undefined}
        data-deprecated={deprecated || undefined}
      >
        <HttpMethod method={method} />
        <span className="openapi-operations-list-item__content">
          <span className="openapi-operations-list-item__path">{path}</span>
          {summary && (
            <span className="openapi-operations-list-item__summary">
              {summary}
            </span>
          )}
        </span>
      </RenderLink>
    </li>
  )
}
