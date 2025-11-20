import type {ReactNode} from "react"

import {Divider} from "@qualcomm-ui/react/divider"

export function DividerOrientationDemo(): ReactNode {
  return (
    <div className="flex gap-4 px-8">
      {/* preview */}
      <span className="text-neutral-primary font-body-md">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </span>

      <Divider orientation="vertical" />

      <span className="text-neutral-primary font-body-md">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </span>
      {/* preview */}
    </div>
  )
}
