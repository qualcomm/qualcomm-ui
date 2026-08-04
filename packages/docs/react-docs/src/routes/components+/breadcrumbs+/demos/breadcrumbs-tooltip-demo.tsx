import type {ReactElement} from "react"

import {Home} from "lucide-react"
import {Link} from "react-router"

import {Breadcrumbs} from "@qualcomm-ui/react/breadcrumbs"
import {Tooltip} from "@qualcomm-ui/react/tooltip"

export function BreadcrumbsTooltipDemo(): ReactElement {
  return (
    // preview
    <Breadcrumbs.Root aria-label="Breadcrumbs">
      <Breadcrumbs.List>
        <Breadcrumbs.ItemRoot>
          <Tooltip
            trigger={
              <Breadcrumbs.ItemTrigger render={<Link to="/" />}>
                <Breadcrumbs.ItemIcon icon={Home} />
                Home
              </Breadcrumbs.ItemTrigger>
            }
          >
            Navigate to home page
          </Tooltip>
          <Breadcrumbs.ItemSeparator />
        </Breadcrumbs.ItemRoot>

        <Breadcrumbs.ItemRoot>
          <Tooltip
            trigger={
              <Breadcrumbs.ItemTrigger
                render={<Link to="/components/overview" />}
              >
                Components
              </Breadcrumbs.ItemTrigger>
            }
          >
            Browse all components
          </Tooltip>
          <Breadcrumbs.ItemSeparator />
        </Breadcrumbs.ItemRoot>

        <Breadcrumbs.Item aria-current="page">Breadcrumbs</Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs.Root>
    // preview
  )
}
