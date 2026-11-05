import type {ReactElement} from "react"

import {AlertBanner} from "@qualcomm-ui/react/alert-banner"

export function AlertBannerEmphasisDemo(): ReactElement {
  return (
    <div className="grid w-full gap-4">
      {/* preview */}
      <AlertBanner
        action={<AlertBanner.Button>Action</AlertBanner.Button>}
        description="Description"
        emphasis="info"
        heading="info"
      />
      {/* preview */}
      <AlertBanner
        action={<AlertBanner.Button>Action</AlertBanner.Button>}
        description="Description"
        emphasis="success"
        heading="success"
      />
      <AlertBanner
        action={<AlertBanner.Button>Action</AlertBanner.Button>}
        description="Description"
        emphasis="warning"
        heading="warning"
      />
      <AlertBanner
        action={<AlertBanner.Button>Action</AlertBanner.Button>}
        description="Description"
        emphasis="danger"
        heading="danger"
      />
      <AlertBanner
        action={<AlertBanner.Button>Action</AlertBanner.Button>}
        description="Description"
        emphasis="neutral"
        heading="neutral"
      />
    </div>
  )
}
