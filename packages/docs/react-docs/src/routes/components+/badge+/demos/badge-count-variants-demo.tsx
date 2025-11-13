import type {ReactElement} from "react"

import {Badge} from "@qualcomm-ui/react/badge"

export default function BadgeCountVariantsDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* preview */}
      <Badge count={5} type="count" variant="neutral" />
      <Badge count={5} type="count" variant="neutral-outline" />
      <Badge count={5} type="count" variant="brand" />
      <Badge count={5} type="count" variant="brand-outline" />
      <Badge count={5} type="count" variant="info" />
      <Badge count={5} type="count" variant="success" />
      <Badge count={5} type="count" variant="warning" />
      <Badge count={5} type="count" variant="danger" />
      <Badge count={5} type="count" variant="persistent-black" />
      <Badge count={5} type="count" variant="persistent-white" />
      {/* preview */}
    </div>
  )
}
