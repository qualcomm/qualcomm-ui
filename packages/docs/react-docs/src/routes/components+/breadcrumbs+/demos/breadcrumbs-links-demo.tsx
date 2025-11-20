import type {ReactElement} from "react"

import {Home} from "lucide-react"
import {Link} from "react-router"

import {Breadcrumbs} from "@qualcomm-ui/react/breadcrumbs"

export function BreadcrumbsLinksDemo(): ReactElement {
  return (
    // preview
    <Breadcrumbs.Root aria-label="Breadcrumbs">
      <Breadcrumbs.List>
        <Breadcrumbs.Item icon={Home} render={<Link to="/" />}>
          Home
        </Breadcrumbs.Item>
        <Breadcrumbs.Item render={<Link to="/components" />}>
          Components
        </Breadcrumbs.Item>
        <Breadcrumbs.Item
          aria-current="page"
          render={<Link to="/components/breadcrumbs" />}
        >
          Breadcrumbs
        </Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs.Root>
    // preview
  )
}
