import type {ReactElement} from "react"

import {AlertBanner} from "@qualcomm-ui/react/alert-banner"

export function AlertBannerExplorerDemo(): ReactElement {
  return (
    <AlertBanner
      action={<AlertBanner.Button>Action</AlertBanner.Button>}
      description="Description"
      dismissable
      heading="Heading"
      variant="subtle"
    />
  )
}
