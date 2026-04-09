import type {ReactElement} from "react"

import {Home} from "lucide-react"
import {Link} from "react-router"

import {
  Breadcrumbs,
  type BreadcrumbsItemData,
} from "@qualcomm-ui/react/breadcrumbs"

// preview
const items: BreadcrumbsItemData[] = [
  {icon: Home, label: "Home", link: <Link to="/" />},
  {label: "Settings", link: <Link to="/settings" />},
  {label: "Account", link: <Link to="/settings/account" />},
  {label: "Security", link: <Link to="/settings/account/security" />},
  {label: "Two-Factor Authentication"},
]

export function BreadcrumbsAutoOverflowDemo(): ReactElement {
  return (
    <div style={{maxWidth: 600, overflow: "auto", resize: "horizontal"}}>
      <Breadcrumbs.Root aria-label="Breadcrumbs">
        <Breadcrumbs.List items={items} maxItems="auto" />
      </Breadcrumbs.Root>
    </div>
  )
}
// preview
