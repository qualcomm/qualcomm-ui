import type {ReactNode} from "react"

import {Divider} from "@qualcomm-ui/react/divider"

export default function DividerShowcaseDemo(): ReactNode {
  return (
    <div className="flex flex-col gap-4 px-8">
      {/* preview */}
      <div className="text-neutral-primary font-body-md">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </div>

      <Divider />

      <div className="text-neutral-primary font-body-md">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </div>
      {/* preview */}
    </div>
  )
}
