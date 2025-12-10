import {useOpenApiContext} from "../../context"

export interface LinkListItem {
  description?: string
  external?: boolean
  href: string
  id: string
  label: string
}

export interface LinkListProps {
  items: LinkListItem[]
  title?: string
}

export function LinkList({items, title}: LinkListProps) {
  const {pathname, renderLink: RenderLink} = useOpenApiContext()

  if (items.length === 0) {
    return null
  }

  return (
    <nav className="openapi-link-list" aria-label={title || "Links"}>
      {title && <h3 className="openapi-link-list__title">{title}</h3>}
      <ul className="openapi-link-list__items">
        {items.map((item) => {
          const isActive = pathname === item.href
          const isExternal = item.external ?? /^https?:\/\//.test(item.href)

          if (isExternal) {
            return (
              <li key={item.id} className="openapi-link-list-item">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="openapi-link-list-item__link"
                  data-external
                >
                  <span className="openapi-link-list-item__label">
                    {item.label}
                  </span>
                  {item.description && (
                    <span className="openapi-link-list-item__description">
                      {item.description}
                    </span>
                  )}
                  <ExternalIcon />
                </a>
              </li>
            )
          }

          return (
            <li key={item.id} className="openapi-link-list-item">
              <RenderLink
                href={item.href}
                className="openapi-link-list-item__link"
                data-active={isActive || undefined}
              >
                <span className="openapi-link-list-item__label">
                  {item.label}
                </span>
                {item.description && (
                  <span className="openapi-link-list-item__description">
                    {item.description}
                  </span>
                )}
              </RenderLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function ExternalIcon() {
  return (
    <svg
      className="openapi-link-list-item__external-icon"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}
