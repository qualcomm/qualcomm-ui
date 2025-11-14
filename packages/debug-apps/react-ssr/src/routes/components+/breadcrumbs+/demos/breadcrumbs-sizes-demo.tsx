import type {ReactElement} from "react"

import {Home} from "lucide-react"

import {Breadcrumbs} from "@qualcomm-ui/react/breadcrumbs"

export default function BreadcrumbsSizesDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      {/* preview */}
      <Breadcrumbs.Root aria-label="Breadcrumbs" size="sm">
        <Breadcrumbs.List>
          <Breadcrumbs.Item icon={Home}>Home</Breadcrumbs.Item>
          <Breadcrumbs.Item>Components</Breadcrumbs.Item>
          <Breadcrumbs.Item aria-current="page">Breadcrumbs</Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs.Root>

      <Breadcrumbs.Root aria-label="Breadcrumbs" size="md">
        <Breadcrumbs.List>
          <Breadcrumbs.Item icon={Home}>Home</Breadcrumbs.Item>
          <Breadcrumbs.Item>Components</Breadcrumbs.Item>
          <Breadcrumbs.Item aria-current="page">Breadcrumbs</Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs.Root>

      <Breadcrumbs.Root aria-label="Breadcrumbs" size="lg">
        <Breadcrumbs.List>
          <Breadcrumbs.Item icon={Home}>Home</Breadcrumbs.Item>
          <Breadcrumbs.Item>Components</Breadcrumbs.Item>
          <Breadcrumbs.Item aria-current="page">Breadcrumbs</Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs.Root>
      {/* preview */}
    </div>
  )
}
