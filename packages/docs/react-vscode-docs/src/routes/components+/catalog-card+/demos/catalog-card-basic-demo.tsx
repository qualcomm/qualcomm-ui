import type {ReactNode} from "react"

import {Badge} from "@qualcomm-ui/react-vscode/badge"
import {
  CatalogCard,
  CatalogCardBadge,
  CatalogCardDetails,
  CatalogCardLabel,
  CatalogCardLogo,
  CatalogCardTag,
} from "@qualcomm-ui/react-vscode/catalog-card"
import {Icon} from "@qualcomm-ui/react-vscode/icon"

export function CatalogCardBasicDemo(): ReactNode {
  return (
    <div>
      <CatalogCard>
        <CatalogCardDetails>
          <CatalogCardLogo className="inline-flex items-center rounded-md bg-yellow-600 p-1 text-black">
            <Icon icon="file-code" size={32} />
          </CatalogCardLogo>
          <CatalogCardLabel>Software</CatalogCardLabel>
          <CatalogCardTag>v1.0</CatalogCardTag>
          <CatalogCardBadge>
            <Badge variant="primary">Update Required</Badge>
          </CatalogCardBadge>
        </CatalogCardDetails>
      </CatalogCard>
    </div>
  )
}
