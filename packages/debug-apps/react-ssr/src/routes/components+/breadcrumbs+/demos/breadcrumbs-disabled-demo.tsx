import type {ReactElement} from "react"

import {Home} from "lucide-react"

import {Breadcrumbs} from "@qualcomm-ui/react/breadcrumbs"

export default function BreadcrumbsDisabledDemo(): ReactElement {
  return (
    <Breadcrumbs.Root aria-label="Breadcrumbs">
      <Breadcrumbs.List>
        <Breadcrumbs.Item icon={Home}>Home</Breadcrumbs.Item>
        {/* preview */}
        <Breadcrumbs.Item disabled>Components</Breadcrumbs.Item>
        {/* preview */}
        <Breadcrumbs.Item aria-current="page">Breadcrumbs</Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs.Root>
  )
}
