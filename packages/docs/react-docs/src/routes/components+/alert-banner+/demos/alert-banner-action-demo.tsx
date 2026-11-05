import type {ReactElement} from "react"

import {AlertBanner} from "@qualcomm-ui/react/alert-banner"

export function AlertBannerActionDemo(): ReactElement {
  return (
    <div className="flex w-full flex-col gap-4">
      {/* preview */}
      <AlertBanner
        action={<AlertBanner.Button>Take action</AlertBanner.Button>}
        heading="Strong"
        variant="strong"
      />

      <AlertBanner
        action={<AlertBanner.Button>Take action</AlertBanner.Button>}
        heading="Subtle"
        variant="subtle"
      />
      {/* preview */}
    </div>
  )
}
