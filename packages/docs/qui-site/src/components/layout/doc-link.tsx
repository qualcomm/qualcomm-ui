import {ComponentPropsWithRef} from "react"

import {Link} from "react-router"

export interface DocLinkProps extends ComponentPropsWithRef<"a"> {
  href: string
}

export function DocLink({href, ref, ...props}: DocLinkProps) {
  return <Link ref={ref} to={href} viewTransition {...props} />
}

DocLink.displayName = "DocLink"
