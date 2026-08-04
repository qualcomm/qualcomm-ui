import type {ReactElement} from "react"

import {AlertBanner} from "@qualcomm-ui/react/alert-banner"

export function AlertBannerCompositeDemo(): ReactElement {
  return (
    // preview
    <AlertBanner.Root onClose={() => console.log("close")}>
      <AlertBanner.Icon />
      <AlertBanner.Heading>Heading</AlertBanner.Heading>
      <AlertBanner.Description>Description</AlertBanner.Description>
      <AlertBanner.Button>Action</AlertBanner.Button>
      <AlertBanner.CloseButton />
    </AlertBanner.Root>
    // preview
  )
}
