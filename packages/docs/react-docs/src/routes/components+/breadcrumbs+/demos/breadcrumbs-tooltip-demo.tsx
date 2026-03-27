import type {ReactElement} from "react"

import {Home} from "lucide-react"

import {Breadcrumbs} from "@qualcomm-ui/react/breadcrumbs"

export function BreadcrumbsTooltipDemo(): ReactElement {
  return (
    <Breadcrumbs.Root aria-label="Breadcrumbs" className="mt-4">
      <Breadcrumbs.List>
        <Breadcrumbs.Item icon={Home} tooltip="Navigate to home page">
          Home
        </Breadcrumbs.Item>
        {/* preview */}
        <Breadcrumbs.Item tooltip="View all components">
          Components
        </Breadcrumbs.Item>
        {/* preview */}
        <Breadcrumbs.Item aria-current="page">Breadcrumbs</Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs.Root>
  )
}
