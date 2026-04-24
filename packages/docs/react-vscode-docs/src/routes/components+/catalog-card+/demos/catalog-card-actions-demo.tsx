import type {ReactNode} from "react"

import {Button} from "@qualcomm-ui/react-vscode/button"
import {
  CatalogCard,
  CatalogCardActions,
  CatalogCardDescription,
  CatalogCardDetails,
  CatalogCardLabel,
  CatalogCardLogo,
  CatalogCardTag,
} from "@qualcomm-ui/react-vscode/catalog-card"
import {Checkbox} from "@qualcomm-ui/react-vscode/checkbox"
import {Icon} from "@qualcomm-ui/react-vscode/icon"

export function CatalogCardActionsDemo(): ReactNode {
  return (
    <div className="w-full p-4">
      <CatalogCard className="w-full">
        <CatalogCardActions>
          <Checkbox />
        </CatalogCardActions>

        <CatalogCardDetails>
          <CatalogCardLogo className="inline-flex items-center rounded-md bg-yellow-600 p-1 text-black">
            <Icon icon="file-code" size={32} />
          </CatalogCardLogo>
          <CatalogCardLabel>Software</CatalogCardLabel>
          <CatalogCardTag>v1.0</CatalogCardTag>
          <CatalogCardDescription className="gap-2 font-medium">
            local/mnt/workspace
            <Icon icon="folder" />
          </CatalogCardDescription>
        </CatalogCardDetails>

        <CatalogCardActions className="text-foreground gap-8">
          <span className="text-xs font-medium">Windows 11</span>
          <div className="flex gap-2">
            <span className="text-xs font-medium">updated required</span>
            <span className="text-xs font-medium">v2.0</span>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">Update</Button>
            <Button>Flash</Button>
          </div>
        </CatalogCardActions>
      </CatalogCard>
    </div>
  )
}
