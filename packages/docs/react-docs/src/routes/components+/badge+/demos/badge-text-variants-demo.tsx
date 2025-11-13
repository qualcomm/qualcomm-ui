import type {ReactElement} from "react"

import {Badge} from "@qualcomm-ui/react/badge"

export default function BadgeTextVariantsDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge emphasis="neutral" variant="subtle">
          Neutral
        </Badge>
        <Badge emphasis="brand" variant="subtle">
          Brand
        </Badge>
        <Badge emphasis="info" variant="subtle">
          Info
        </Badge>
        <Badge emphasis="success" variant="subtle">
          Success
        </Badge>
        <Badge emphasis="warning" variant="subtle">
          Warning
        </Badge>
        <Badge emphasis="danger" variant="subtle">
          Danger
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge emphasis="cat-1" variant="subtle">
          Cat 1
        </Badge>
        <Badge emphasis="cat-2" variant="subtle">
          Cat 2
        </Badge>
        <Badge emphasis="cat-3" variant="subtle">
          Cat 3
        </Badge>
        <Badge emphasis="cat-4" variant="subtle">
          Cat 4
        </Badge>
        <Badge emphasis="cat-5" variant="subtle">
          Cat 5
        </Badge>
        <Badge emphasis="cat-6" variant="subtle">
          Cat 6
        </Badge>
        <Badge emphasis="cat-7" variant="subtle">
          Cat 7
        </Badge>
        <Badge emphasis="cat-8" variant="subtle">
          Cat 8
        </Badge>
        <Badge emphasis="cat-9" variant="subtle">
          Cat 9
        </Badge>
        <Badge emphasis="cat-10" variant="subtle">
          Cat 10
        </Badge>
      </div>
    </div>
  )
}
