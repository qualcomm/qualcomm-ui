import type {ReactElement} from "react"

import {AlertBanner} from "@qualcomm-ui/react/alert-banner"

export function AlertBannerSimpleDemo(): ReactElement {
  return (
    // preview
    <AlertBanner
      action={<AlertBanner.Button>Action</AlertBanner.Button>}
      description="Description"
      dismissable
      heading="Heading"
      onClose={() => console.log("close")}
    />
    // preview
  )
}
