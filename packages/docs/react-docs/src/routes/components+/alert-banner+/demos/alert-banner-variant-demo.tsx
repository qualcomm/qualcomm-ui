import type {ReactElement} from "react"

import {AlertBanner} from "@qualcomm-ui/react/alert-banner"

export function AlertBannerVariantDemo(): ReactElement {
  return (
    <div className="grid w-full gap-4">
      {/* preview */}
      <AlertBanner
        action={<AlertBanner.Button>Action</AlertBanner.Button>}
        description="Description"
        emphasis="info"
        heading="info"
        variant="subtle"
      />
      {/* preview */}
      <AlertBanner
        action={<AlertBanner.Button>Action</AlertBanner.Button>}
        description="Description"
        emphasis="success"
        heading="success"
        variant="subtle"
      />
      <AlertBanner
        action={<AlertBanner.Button>Action</AlertBanner.Button>}
        description="Description"
        emphasis="warning"
        heading="warning"
        variant="subtle"
      />
      <AlertBanner
        action={<AlertBanner.Button>Action</AlertBanner.Button>}
        description="Description"
        emphasis="danger"
        heading="danger"
        variant="subtle"
      />
      <AlertBanner
        action={<AlertBanner.Button>Action</AlertBanner.Button>}
        description="Description"
        emphasis="neutral"
        heading="neutral"
        variant="subtle"
      />
    </div>
  )
}
