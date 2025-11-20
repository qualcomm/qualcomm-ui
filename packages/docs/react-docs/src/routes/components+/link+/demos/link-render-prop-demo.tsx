import type {ReactElement} from "react"

import {Link as ReactRouterLink} from "react-router"

import {Link} from "@qualcomm-ui/react/link"

export function LinkRenderPropDemo(): ReactElement {
  return (
    // preview
    <Link render={<ReactRouterLink to="/components/link#as-prop" />}>Link</Link>
    // preview
  )
}
