import type {HTMLAttributes, ReactNode} from "react"

import {useOpenApiContext} from "../../context"

export interface AnchorProps extends HTMLAttributes<HTMLAnchorElement> {
  children?: ReactNode
  external?: boolean
  href: string
}

/**
 * Anchor component that uses the RenderLink from context for client-side routing.
 * Falls back to a standard anchor tag if no custom renderLink is provided.
 */
export function Anchor({children, external, href, ...props}: AnchorProps) {
  const {basePath, renderLink: RenderLink} = useOpenApiContext()

  const isExternal = external ?? isExternalUrl(href)

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="openapi-anchor openapi-anchor--external"
        {...props}
      >
        {children}
      </a>
    )
  }

  const resolvedHref = basePath ? `${basePath}${href}` : href

  return (
    <RenderLink href={resolvedHref} className="openapi-anchor" {...props}>
      {children}
    </RenderLink>
  )
}

function isExternalUrl(url: string): boolean {
  return /^(https?:\/\/|mailto:|tel:)/.test(url)
}
