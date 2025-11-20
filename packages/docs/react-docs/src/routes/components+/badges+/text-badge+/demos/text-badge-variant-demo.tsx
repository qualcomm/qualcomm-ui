import type {ReactElement} from "react"

import {Badge} from "@qualcomm-ui/react/badge"

export function TextBadgeVariantDemo(): ReactElement {
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
        <Badge emphasis="blue" variant="subtle">
          blue
        </Badge>
        <Badge emphasis="cyan" variant="subtle">
          cyan
        </Badge>
        <Badge emphasis="green" variant="subtle">
          green
        </Badge>
        <Badge emphasis="kiwi" variant="subtle">
          kiwi
        </Badge>
        <Badge emphasis="magenta" variant="subtle">
          magenta
        </Badge>
        <Badge emphasis="orange" variant="subtle">
          orange
        </Badge>
        <Badge emphasis="purple" variant="subtle">
          purple
        </Badge>
        <Badge emphasis="red" variant="subtle">
          red
        </Badge>
        <Badge emphasis="teal" variant="subtle">
          teal
        </Badge>
        <Badge emphasis="yellow" variant="subtle">
          yellow
        </Badge>
      </div>
    </div>
  )
}
