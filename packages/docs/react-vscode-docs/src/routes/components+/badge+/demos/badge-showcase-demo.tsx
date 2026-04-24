import type {ReactNode} from "react"
import {Fragment} from "react"

import type {BadgeSize} from "@qualcomm-ui/react-vscode/badge"
import {Badge} from "@qualcomm-ui/react-vscode/badge"

const sizes: BadgeSize[] = ["xs", "sm", "md"]

export function BadgeShowcaseDemo(): ReactNode {
  return (
    <div className="text-foreground grid justify-center">
      <div className="grid grid-cols-3 items-center gap-x-8 gap-y-6">
        <span />
        <span>Primary</span>
        <span>Secondary</span>

        {sizes.map((size) => (
          <Fragment key={size}>
            <span>{size}</span>
            <Badge size={size} variant="primary">
              1
            </Badge>
            <Badge size={size} variant="secondary">
              1
            </Badge>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
