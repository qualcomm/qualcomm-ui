import type {ReactElement} from "react"

import {Home} from "lucide-react"
import {Link} from "react-router"

import {Breadcrumbs} from "@qualcomm-ui/react/breadcrumbs"

export function BreadcrumbsEmphasisDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      {/* preview */}
      <Breadcrumbs.Root aria-label="Breadcrumbs">
        <Breadcrumbs.List>
          <Breadcrumbs.Item icon={Home} render={<Link to="/" />}>
            Home
          </Breadcrumbs.Item>
          <Breadcrumbs.Item render={<Link to="/components/overview" />}>
            Components
          </Breadcrumbs.Item>
          <Breadcrumbs.Item aria-current="page">Breadcrumbs</Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs.Root>

      <Breadcrumbs.Root aria-label="Breadcrumbs" emphasis="neutral">
        <Breadcrumbs.List>
          <Breadcrumbs.Item icon={Home} render={<Link to="/" />}>
            Home
          </Breadcrumbs.Item>
          <Breadcrumbs.Item render={<Link to="/components/overview" />}>
            Components
          </Breadcrumbs.Item>
          <Breadcrumbs.Item aria-current="page">Breadcrumbs</Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs.Root>
      {/* preview */}
    </div>
  )
}
