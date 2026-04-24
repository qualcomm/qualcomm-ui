import type {ReactElement} from "react"

import {Badge} from "@qualcomm-ui/react/badge"

export function TextBadgeVariantDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge emphasis="neutral" variant="subtle">
          neutral
        </Badge>
        <Badge emphasis="brand" variant="subtle">
          brand
        </Badge>
        <Badge emphasis="info" variant="subtle">
          info
        </Badge>
        <Badge emphasis="success" variant="subtle">
          success
        </Badge>
        <Badge emphasis="warning" variant="subtle">
          warning
        </Badge>
        <Badge emphasis="danger" variant="subtle">
          danger
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge emphasis="blue" variant="subtle">
          blue
        </Badge>
        <Badge emphasis="cyan" variant="subtle">
          cyan
        </Badge>
        <Badge emphasis="teal" variant="subtle">
          teal
        </Badge>
        <Badge emphasis="lime" variant="subtle">
          lime
        </Badge>
        <Badge emphasis="green" variant="subtle">
          green
        </Badge>
        <Badge emphasis="yellow" variant="subtle">
          yellow
        </Badge>
        <Badge emphasis="amber" variant="subtle">
          amber
        </Badge>
        <Badge emphasis="orange" variant="subtle">
          orange
        </Badge>
        <Badge emphasis="red" variant="subtle">
          red
        </Badge>
        <Badge emphasis="magenta" variant="subtle">
          magenta
        </Badge>
        <Badge emphasis="violet" variant="subtle">
          violet
        </Badge>
        <Badge emphasis="purple" variant="subtle">
          purple
        </Badge>
      </div>
    </div>
  )
}
