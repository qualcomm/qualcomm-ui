import type {ReactElement} from "react"

import {Home} from "lucide-react"

import {
  Breadcrumbs,
  type BreadcrumbsItemData,
} from "@qualcomm-ui/react/breadcrumbs"

// preview
const items: BreadcrumbsItemData[] = [
  {href: "/", icon: Home, label: "Home"},
  {href: "/components", label: "Components"},
  {label: "Breadcrumbs"},
]

export function BreadcrumbsItemsDemo(): ReactElement {
  return (
    <Breadcrumbs.Root aria-label="Breadcrumbs">
      <Breadcrumbs.List items={items} />
    </Breadcrumbs.Root>
  )
}
// preview
